import { saveProgress, getProgress, saveWord, getWords, clearAll } from '../progress';

// Mock AsyncStorage
const mockStorage: Record<string, string> = {};

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn((key: string, value: string) => {
    mockStorage[key] = value;
    return Promise.resolve();
  }),
  getItem: jest.fn((key: string) => {
    return Promise.resolve(mockStorage[key] ?? null);
  }),
  multiRemove: jest.fn((keys: string[]) => {
    keys.forEach((k) => delete mockStorage[k]);
    return Promise.resolve();
  }),
}));

describe('ReadingProgress', () => {
  beforeEach(async () => {
    Object.keys(mockStorage).forEach((k) => delete mockStorage[k]);
    await clearAll();
  });

  test('saves and loads last read page', async () => {
    await saveProgress('book-1', 'chapter-1', 15);
    const progress = await getProgress('book-1');
    expect(progress).not.toBeNull();
    expect(progress!.chapterId).toBe('chapter-1');
    expect(progress!.pageNumber).toBe(15);
  });

  test('returns null for unknown book', async () => {
    const progress = await getProgress('nonexistent');
    expect(progress).toBeNull();
  });

  test('overwrites progress for same book', async () => {
    await saveProgress('book-1', 'chapter-1', 5);
    await saveProgress('book-1', 'chapter-2', 10);
    const progress = await getProgress('book-1');
    expect(progress!.chapterId).toBe('chapter-2');
    expect(progress!.pageNumber).toBe(10);
  });

  test('saves looked-up words', async () => {
    await saveWord({ surface: '天気', reading: 'てんき', meaning: '天氣' });
    const words = await getWords();
    expect(words).toContainEqual(
      expect.objectContaining({ surface: '天気' }),
    );
  });

  test('does not save duplicate words', async () => {
    await saveWord({ surface: '天気', reading: 'てんき', meaning: '天氣' });
    await saveWord({ surface: '天気', reading: 'てんき', meaning: '天氣' });
    const words = await getWords();
    const matches = words.filter((w) => w.surface === '天気');
    expect(matches).toHaveLength(1);
  });

  test('returns empty array when no words saved', async () => {
    const words = await getWords();
    expect(words).toEqual([]);
  });
});
