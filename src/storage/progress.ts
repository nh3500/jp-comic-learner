import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ReadingProgress {
  bookId: string;
  chapterId: string;
  pageNumber: number;
  updatedAt: number;
}

export interface SavedWord {
  surface: string;
  reading: string;
  meaning: string;
  savedAt: number;
}

const PROGRESS_KEY = 'reading_progress';
const WORDS_KEY = 'saved_words';

export async function saveProgress(
  bookId: string,
  chapterId: string,
  pageNumber: number,
): Promise<void> {
  const allProgress = await getAllProgress();
  allProgress[bookId] = {
    bookId,
    chapterId,
    pageNumber,
    updatedAt: Date.now(),
  };
  await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(allProgress));
}

export async function getProgress(
  bookId: string,
): Promise<ReadingProgress | null> {
  const allProgress = await getAllProgress();
  return allProgress[bookId] ?? null;
}

async function getAllProgress(): Promise<Record<string, ReadingProgress>> {
  const raw = await AsyncStorage.getItem(PROGRESS_KEY);
  if (!raw) return {};
  return JSON.parse(raw);
}

export async function saveWord(word: Omit<SavedWord, 'savedAt'>): Promise<void> {
  const words = await getWords();
  const exists = words.some((w) => w.surface === word.surface);
  if (!exists) {
    words.push({ ...word, savedAt: Date.now() });
    await AsyncStorage.setItem(WORDS_KEY, JSON.stringify(words));
  }
}

export async function getWords(): Promise<SavedWord[]> {
  const raw = await AsyncStorage.getItem(WORDS_KEY);
  if (!raw) return [];
  return JSON.parse(raw);
}

export async function clearAll(): Promise<void> {
  await AsyncStorage.multiRemove([PROGRESS_KEY, WORDS_KEY]);
}
