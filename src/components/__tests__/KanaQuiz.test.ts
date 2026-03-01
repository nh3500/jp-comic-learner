import { getQuizQuestion, checkAnswer } from '../KanaQuiz';
import { HIRAGANA } from '../../data/kana';

describe('KanaQuiz', () => {
  test('getQuizQuestion returns a kana with 4 choices', () => {
    const question = getQuizQuestion(HIRAGANA);
    expect(question.target).toBeDefined();
    expect(question.choices).toHaveLength(4);
    expect(question.choices).toContain(question.target.romaji);
  });

  test('checkAnswer returns true for correct answer', () => {
    const target = HIRAGANA[0]; // あ = a
    expect(checkAnswer(target, 'a')).toBe(true);
  });

  test('checkAnswer returns false for wrong answer', () => {
    const target = HIRAGANA[0]; // あ = a
    expect(checkAnswer(target, 'ka')).toBe(false);
  });

  test('choices are shuffled (not always in same order)', () => {
    const results = new Set<string>();
    for (let i = 0; i < 20; i++) {
      const q = getQuizQuestion(HIRAGANA);
      results.add(q.choices.join(','));
    }
    expect(results.size).toBeGreaterThan(1);
  });

  test('choices do not contain duplicates', () => {
    for (let i = 0; i < 20; i++) {
      const q = getQuizQuestion(HIRAGANA);
      const unique = new Set(q.choices);
      expect(unique.size).toBe(q.choices.length);
    }
  });
});
