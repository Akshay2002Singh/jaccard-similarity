import { describe, it, expect } from 'vitest';
import JaccardSuggester from '../src/index';

describe('JaccardSuggester', () => {
  it('suggests similar strings', () => {
    const s = new JaccardSuggester(['apple pie', 'banana split', 'pineapple tart']);
    const r = s.suggest('apple');
    expect(r[0].item.text).toContain('apple');
    expect(r[0].score).toBeGreaterThan(0);
  });
});
