import { MangaSource, MangaBook, MangaChapter, MangaPage } from '../types';

describe('MangaSource types', () => {
  test('MangaSource interface is importable and usable', () => {
    const mockSource: MangaSource = {
      name: 'test',
      getBooks: async () => [],
      getChapters: async (_bookId: string) => [],
      getPages: async (_chapterId: string) => [],
    };
    expect(mockSource.name).toBe('test');
  });

  test('MangaBook has required fields', () => {
    const book: MangaBook = {
      id: '1',
      title: 'Test Manga',
      chapterCount: 10,
    };
    expect(book.id).toBe('1');
    expect(book.coverUri).toBeUndefined();
  });

  test('MangaPage has required fields', () => {
    const page: MangaPage = {
      id: 'p1',
      imageUri: 'file:///test.jpg',
      pageNumber: 1,
    };
    expect(page.imageUri).toContain('test.jpg');
  });
});
