import { HIRAGANA, KATAKANA, KanaChar } from '../kana';

describe('Kana Data', () => {
  test('hiragana contains 46 basic characters', () => {
    expect(HIRAGANA.length).toBe(46);
  });

  test('katakana contains 46 basic characters', () => {
    expect(KATAKANA.length).toBe(46);
  });

  test('each kana has char, romaji, and row', () => {
    const first = HIRAGANA[0];
    expect(first).toHaveProperty('char');
    expect(first).toHaveProperty('romaji');
    expect(first).toHaveProperty('row');
  });

  test('hiragana and katakana have matching romaji', () => {
    for (let i = 0; i < HIRAGANA.length; i++) {
      expect(HIRAGANA[i].romaji).toBe(KATAKANA[i].romaji);
    }
  });

  test('all romaji values are unique', () => {
    const romajiSet = new Set(HIRAGANA.map((k) => k.romaji));
    expect(romajiSet.size).toBe(HIRAGANA.length);
  });
});
