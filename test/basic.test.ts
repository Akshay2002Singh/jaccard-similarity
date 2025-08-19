import { describe, it, expect } from 'vitest';
import JaccardSuggester from '../src/index';

describe('JaccardSuggester', () => {
  it('suggests similar strings', () => {
    const s = new JaccardSuggester(['apple pie', 'banana split', 'pineapple tart']);
    const r = s.suggest('apple');

    expect(r.length).toBeGreaterThan(0);   // ✅ ensure non-empty
    expect(r[0]!.item.text).toContain('apple'); // ✅ non-null assertion
    expect(r[0]!.score).toBeGreaterThan(0);
  });
});
