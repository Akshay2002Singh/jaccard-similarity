// src/pages/JaccardShowcase.tsx
import { useMemo, useState } from "react";
import JaccardSuggester, { defaultStopWords, type Item } from "jaccard-suggest";

export default function JaccardShowcase() {
  // ----------------------------
  // State for playground
  // ----------------------------
  const [items, setItems] = useState<Item[]>([
    { id: "u1", text: "iron man", meta: { year: 2008 } },
    { id: "u2", text: "superman returns", meta: { year: 2006 } },
    { id: "u3", text: "batman begins", meta: { year: 2005 } },
    { id: "u4", text: "apple pie", meta: { type: "food" } },
    { id: "u5", text: "apple juice", meta: { type: "drink" } },
  ]);
  const [query, setQuery] = useState("");
  const [newItemText, setNewItemText] = useState("");
  const [stopWordsEnabled, setStopWordsEnabled] = useState(true);
  const [minScore, setMinScore] = useState(0);
  const [topK, setTopK] = useState(5);

  // ----------------------------
  // Create suggester
  // ----------------------------
  const suggester = useMemo(() => {
    return new JaccardSuggester(items, {
      stopWords: stopWordsEnabled ? new Set(defaultStopWords) : undefined,
      minScore,
      topK,
    });
  }, [items, stopWordsEnabled, minScore, topK]);

  const results = suggester.suggest(query);

  // ----------------------------
  // Handlers
  // ----------------------------
  const handleAdd = () => {
    const newItem = {
      id: `u${items.length + 1}`,
      text: newItemText,
      meta: { custom: true },
    };
    setItems([...items, newItem]);
    setNewItemText(""); // reset add input
  };

  const handleRemove = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  // ----------------------------
  // Render
  // ----------------------------
  return (
    <div
      style={{
        padding: "2rem",
        fontFamily: "sans-serif",
        background: "#1a1a1a",
        color: "#fff",
        lineHeight: 1.5,
      }}
    >
      <h1 style={{textAlign: 'center'}}>Jaccard Similarity Demo</h1>
      <p>
        This page demonstrates both a <strong>basic usage example</strong> and a
        more <strong>interactive playground</strong> for exploring{" "}
        <code>jaccard-suggest</code>.
      </p>

      {/* ---------------- Basic Example ---------------- */}
      <section
        style={{
          margin: "2rem 0",
          padding: "1.5rem",
          background: "#222",
          borderRadius: "8px",
        }}
      >
        <h2>🚀 Quick Start Example</h2>
        <pre
          style={{
            background: "#111",
            padding: "1rem",
            borderRadius: "6px",
            overflowX: "auto",
          }}
        >{`import JaccardSuggester from "jaccard-suggest";

const suggester = new JaccardSuggester([
  "apple pie",
  "banana smoothie",
  "chocolate cake",
  "apple juice",
]);

console.log(suggester.suggest("apple"));
// Output -> [
//   { item: { id: "0", text: "apple pie" }, score: 0.5 },
//   { item: { id: "3", text: "apple juice" }, score: 0.5 }
// ]`}</pre>

        {/* Minimal live demo */}
        <BasicDemo />
      </section>

      {/* ---------------- Playground ---------------- */}
      <section
        style={{
          margin: "2rem 0",
          padding: "1.5rem",
          background: "#222",
          borderRadius: "8px",
        }}
      >
        <h2>⚡ Interactive Playground</h2>
        <p>
          Play with stopwords, minScore, topK, and dynamically add/remove items
          to see how suggestions change.
        </p>

        {/* Search */}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type a query (e.g. apple, man)..."
          style={{
            padding: "0.5rem",
            width: "100%",
            marginBottom: "1rem",
            borderRadius: "4px",
          }}
        />

        {/* Options */}
        <div style={{ marginBottom: "1rem" }}>
          <label>
            <input
              type="checkbox"
              checked={stopWordsEnabled}
              onChange={(e) => setStopWordsEnabled(e.target.checked)}
            />{" "}
            Use stopwords
          </label>
          <br />
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "0.5rem",
              }}
            >
              <span style={{ width: "120px", display: "inline-block" }}>
                Min score: {minScore.toFixed(2)}
              </span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={minScore}
                onChange={(e) => setMinScore(Number(e.target.value))}
                style={{ flex: 1 }}
              />
            </label>

            <label style={{ display: "flex", alignItems: "center" }}>
              <span style={{ width: "70px", display: "inline-block" }}>
                Top K: {topK}
              </span>
              <input
                type="number"
                value={topK}
                onChange={(e) => setTopK(Number(e.target.value))}
                style={{ width: "80px", marginLeft: "0.5rem" }}
              />
            </label>
          </div>
        </div>

        {/* Add Item */}
        <div style={{ marginBottom: "1rem" }}>
          <input
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            placeholder="New item text..."
            style={{ padding: "0.5rem", marginRight: "0.5rem", width: "60%" }}
          />
          <button onClick={handleAdd} disabled={!newItemText}>
            ➕ Add
          </button>
        </div>

        {/* Items */}
        <h3>📦 Items ({items.length})</h3>
        <ul>
          {items.map((i) => (
            <li key={i.id} style={{ padding: "2px 0px" }}>
              {i.text}{" "}
              <button onClick={() => handleRemove(i.id)}>❌ Remove</button>
            </li>
          ))}
        </ul>

        {/* Results */}
        <h3>🔍 Suggestions for "{query}"</h3>
        <pre
          style={{ background: "#111", padding: "1rem", borderRadius: "6px" }}
        >
          {JSON.stringify(results, null, 2) || "No results yet"}
        </pre>
      </section>
    </div>
  );
}

// ---------------- Basic Demo Component ----------------
function BasicDemo() {
  const [query, setQuery] = useState("");
  const suggester = useMemo(
    () =>
      new JaccardSuggester([
        "apple pie",
        "banana smoothie",
        "chocolate cake",
        "apple juice",
      ]),
    []
  );

  const results = query ? suggester.suggest(query) : [];

  return (
    <div style={{ marginTop: "1rem" }}>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Try typing 'apple'..."
        style={{ padding: "0.5rem", width: "100%" }}
      />
      <pre
        style={{
          marginTop: "1rem",
          background: "#111",
          padding: "1rem",
          borderRadius: "6px",
        }}
      >
        {JSON.stringify(results, null, 2) || "No results yet"}
      </pre>
    </div>
  );
}
