import React, { useState } from "react";

const codeBlockStyle: React.CSSProperties = {
  position: "relative",
  background: "#2d2d2d",
  color: "#f8f8f2",
  fontFamily: "monospace",
  fontSize: "0.9rem",
  padding: "0.75rem",
  borderRadius: "6px",
  overflowX: "auto",
  marginBottom: "1rem",
  whiteSpace: "pre",
};

const copyBtnStyle: React.CSSProperties = {
  position: "absolute",
  top: "6px",
  right: "6px",
  background: "#444",
  color: "#fff",
  border: "none",
  fontSize: "0.75rem",
  padding: "0.25rem 0.5rem",
  borderRadius: "4px",
  cursor: "pointer",
};

const copiedBadgeStyle: React.CSSProperties = {
  position: "absolute",
  top: "6px",
  right: "64px",
  background: "#2c7a7b",
  color: "#fff",
  padding: "0.25rem 0.5rem",
  borderRadius: "4px",
  fontSize: "0.75rem",
};

export default function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <div style={codeBlockStyle}>
      <button style={copyBtnStyle} onClick={handleCopy}>
        {copied ? "Copied" : "Copy"}
      </button>
      {copied && <div style={copiedBadgeStyle}>Copied ✓</div>}
      <pre style={{ margin: 0, textAlign: "left" }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}
