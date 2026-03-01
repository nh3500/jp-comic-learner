import { MangaBook, MangaChapter, MangaPage, MangaSource } from '../types';

const IMAGE_EXTENSIONS = /\.(jpg|jpeg|png|webp|gif|bmp)$/i;

export class ArchiveSource implements MangaSource {
  name = 'archive';

  private basePath: string;
  private books: Map<string, { title: string; chapters: Map<string, string[]> }> = new Map();

  constructor(basePath: string) {
    this.basePath = basePath;
  }

  static filterImageFiles(files: string[]): string[] {
    return files.filter((f) => IMAGE_EXTENSIONS.test(f));
  }

  static sortPages(files: string[]): string[] {
    return [...files].sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] ?? '0', 10);
      const numB = parseInt(b.match(/\d+/)?.[0] ?? '0', 10);
      return numA - numB;
    });
  }

  async getBooks(): Promise<MangaBook[]> {
    return Array.from(this.books.entries()).map(([id, book]) => ({
      id,
      title: book.title,
      chapterCount: book.chapters.size,
    }));
  }

  async getChapters(bookId: string): Promise<MangaChapter[]> {
    const book = this.books.get(bookId);
    if (!book) return [];
    return Array.from(book.chapters.entries()).map(([id, pages]) => ({
      id,
      title: id,
      pageCount: pages.length,
    }));
  }

  async getPages(chapterId: string): Promise<MangaPage[]> {
    for (const book of this.books.values()) {
      const pages = book.chapters.get(chapterId);
      if (pages) {
        return pages.map((uri, i) => ({
          id: `${chapterId}-${i}`,
          imageUri: uri,
          pageNumber: i + 1,
        }));
      }
    }
    return [];
  }

  registerBook(id: string, title: string, chapterPages: Record<string, string[]>) {
    const chapters = new Map<string, string[]>();
    for (const [chId, pages] of Object.entries(chapterPages)) {
      chapters.set(chId, ArchiveSource.sortPages(ArchiveSource.filterImageFiles(pages)));
    }
    this.books.set(id, { title, chapters });
  }
}
