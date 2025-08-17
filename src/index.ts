export type Tokenizer = (s: string) => string[];

export interface Item {
  id: string;
  text: string;
  meta?: unknown;
}

export interface SuggestResult<T = Item> {
  item: T;
  score: number; // Jaccard score in [0,1]
}

export interface Options<T = Item> {
  tokenizer?: Tokenizer;
  minScore?: number; // default 0
  topK?: number;     // default 5
}

const defaultTokenizer: Tokenizer = (s) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .match(/\p{Letter}+\p{Mark}*|\p{Number}+/gu)?.map(t => t) ?? [];

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 1;
  let inter = 0;
  // iterate smaller set for speed
  const [s, l] = a.size < b.size ? [a, b] : [b, a];
  for (const x of s) if (l.has(x)) inter++;
  const union = a.size + b.size - inter;
  return union === 0 ? 0 : inter / union;
}

export class JaccardSuggester<T extends Item = Item> {
  private tokenizer: Tokenizer;
  private minScore: number;
  private topK: number;

  private items: T[] = [];
  private tokens: Set<string>[] = [];
  private inverted: Map<string, Set<number>> = new Map(); // token -> itemIdx

  constructor(data: (string | T)[] = [], opts: Options<T> = {}) {
    this.tokenizer = opts.tokenizer ?? defaultTokenizer;
    this.minScore = opts.minScore ?? 0;
    this.topK = opts.topK ?? 5;
    for (const d of data) this.add(d);
  }

  size() { return this.items.length; }

  add(d: string | T): T {
    const item: T = typeof d === 'string' ? ({ id: String(this.items.length), text: d } as T) : d;
    const idx = this.items.length;
    const toks = new Set(this.tokenizer(item.text));
    this.items.push(item);
    this.tokens.push(toks);
    for (const t of toks) {
      if (!this.inverted.has(t)) this.inverted.set(t, new Set());
      this.inverted.get(t)!.add(idx);
    }
    return item;
  }

  remove(id: string): boolean {
    const idx = this.items.findIndex(i => i.id === id);
    if (idx === -1) return false;
    // lazy delete (mark empty); keeps indexes stable
    const toks = this.tokens[idx];
    for (const t of toks) this.inverted.get(t)?.delete(idx);
    this.items[idx] = { id: id, text: '', meta: undefined } as T;
    this.tokens[idx] = new Set();
    return true;
  }

  update(id: string, text: string): boolean {
    const idx = this.items.findIndex(i => i.id === id);
    if (idx === -1) return false;
    // remove old tokens
    for (const t of this.tokens[idx]) this.inverted.get(t)?.delete(idx);
    // add new tokens
    const toks = new Set(this.tokenizer(text));
    this.tokens[idx] = toks;
    for (const t of toks) {
      if (!this.inverted.has(t)) this.inverted.set(t, new Set());
      this.inverted.get(t)!.add(idx);
    }
    this.items[idx].text = text;
    return true;
  }

  suggest(query: string, opts?: Partial<Options<T>>): SuggestResult<T>[] {
    const tokenizer = opts?.tokenizer ?? this.tokenizer;
    const minScore = opts?.minScore ?? this.minScore;
    const topK = opts?.topK ?? this.topK;

    const qTokens = new Set(tokenizer(query));
    if (qTokens.size === 0) return [];

    // collect candidates via inverted index (union of posting lists)
    const candIdxs = new Set<number>();
    for (const t of qTokens) {
      const posting = this.inverted.get(t);
      if (posting) for (const i of posting) candIdxs.add(i);
    }
    if (candIdxs.size === 0) return [];

    // score candidates
    const results: SuggestResult<T>[] = [];
    for (const i of candIdxs) {
      const score = jaccard(qTokens, this.tokens[i]);
      if (score >= minScore) {
        results.push({ item: this.items[i], score });
      }
    }
    results.sort((a, b) => b.score - a.score);
    return results.slice(0, topK);
  }
}

// convenience default export
export default JaccardSuggester;
