export interface MangaPage {
  id: string;
  imageUri: string;
  pageNumber: number;
}

export interface MangaChapter {
  id: string;
  title: string;
  pageCount: number;
}

export interface MangaBook {
  id: string;
  title: string;
  coverUri?: string;
  chapterCount: number;
}

export interface MangaSource {
  name: string;
  getBooks(): Promise<MangaBook[]>;
  getChapters(bookId: string): Promise<MangaChapter[]>;
  getPages(chapterId: string): Promise<MangaPage[]>;
}
