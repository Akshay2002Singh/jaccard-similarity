# 📦 jaccard-suggest

Fast **Jaccard-similarity based auto-suggestion** for JavaScript & TypeScript.  
Useful for **search**, **autocomplete**, **spell-check**, or **fuzzy matching** tasks.

---

## ✨ Features
- 🔍 Suggest similar items using **Jaccard similarity** (`[0,1]` score).
- ⚡ Maintains an **inverted index** for efficient lookup.
- 📝 Supports **add, remove, update** operations.
- 🔧 Configurable **tokenizer, minScore, topK** results.
- ✅ Fully typed (TypeScript).

---

## 📥 Installation

```bash
npm install jaccard-suggest
```
or
```bash
yarn add jaccard-suggest
```

## 🚀 Usage

```js
import JaccardSuggester from "jaccard-suggest";

// Initialize with some items
const suggester = new JaccardSuggester([
  "apple pie",
  "banana smoothie",
  "chocolate cake",
  "apple juice",
]);

console.log("Total items:", suggester.size()); 
// -> 4

// Find suggestions
console.log(suggester.suggest("apple"));
/*
[
  { item: { id: '0', text: 'apple pie' }, score: 0.5 },
  { item: { id: '3', text: 'apple juice' }, score: 0.5 }
]
*/

// Update an item
suggester.update("1", "banana milkshake");

// Remove an item
suggester.remove("2");

// Suggest again
console.log(suggester.suggest("banana"));
```

## ⚙️ API

### Constructor
```js
new JaccardSuggester(data?: (string | T)[], options?: Options<T>)
```
- data: initial items (strings or custom objects).
- options:
    - tokenizer?: (s: string) => string[] → split text into tokens (default: lowercased words & numbers).
    - minScore?: number → minimum Jaccard similarity score (default: 0).
    - topK?: number → maximum number of results to return (default: 5).

### Methods
Method | Description
- .add(d: string | T): T  => Add a new item (string or object with { id, text, meta? }).
- .remove(id: string): boolean  => Remove an item by its id.
- .update(id: string, text: string): boolean  => Update the text of an existing item.
- .suggest(query: string, options?: Options<T>): SuggestResult<T>[]  => .suggest(query: string, options?: Options<T>): SuggestResult<T>[]
- .size(): number  => Get total number of items in the index.


### Types

```js
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
  tokenizer?: (s: string) => string[];
  minScore?: number;
  topK?: number;
}
```

## 🔬 How it Works

1. Each item’s text is tokenized into words (e.g., "apple pie" → { "apple", "pie" }).
2. An inverted index maps each token → items that contain it.
    
    Example: "apple" → items [0, 3].
3. When you search:
    - The query is tokenized.
    - Candidate items are retrieved from the inverted index.
    - Each candidate is scored with Jaccard similarity:
    
        score = ∣A∪B∣/∣A∩B∣​
4. Results are sorted by score and returned.

## Example with Custom Objects
```js
const suggester = new JaccardSuggester([
  { id: "u1", text: "iron man", meta: { year: 2008 } },
  { id: "u2", text: "superman returns", meta: { year: 2006 } },
  { id: "u3", text: "batman begins", meta: { year: 2005 } },
]);

console.log(suggester.suggest("man"));
/*
[
  { item: { id: 'u1', text: 'iron man', meta: { year: 2008 } }, score: 0.333... },
  { item: { id: 'u2', text: 'superman returns', meta: { year: 2006 } }, score: 0.25 },
  { item: { id: 'u3', text: 'batman begins', meta: { year: 2005 } }, score: 0.25 }
]
*/
```
