import { ArchiveSource } from '../archive';

describe('ArchiveSource', () => {
  test('filters image files from archive entries', () => {
    const imageFiles = ArchiveSource.filterImageFiles([
      'page001.jpg',
      'page002.png',
      'thumbs.db',
      'metadata.xml',
      'page003.webp',
    ]);
    expect(imageFiles).toEqual([
      'page001.jpg',
      'page002.png',
      'page003.webp',
    ]);
  });

  test('sorts pages naturally', () => {
    const sorted = ArchiveSource.sortPages([
      'page10.jpg',
      'page2.jpg',
      'page1.jpg',
    ]);
    expect(sorted).toEqual([
      'page1.jpg',
      'page2.jpg',
      'page10.jpg',
    ]);
  });

  test('registerBook and getBooks works', async () => {
    const source = new ArchiveSource('/manga');
    source.registerBook('b1', 'Test Manga', {
      'ch1': ['page1.jpg', 'page2.jpg'],
    });
    const books = await source.getBooks();
    expect(books).toHaveLength(1);
    expect(books[0].title).toBe('Test Manga');
  });

  test('getChapters returns chapters for a book', async () => {
    const source = new ArchiveSource('/manga');
    source.registerBook('b1', 'Test Manga', {
      'ch1': ['page1.jpg', 'page2.jpg'],
      'ch2': ['page1.png'],
    });
    const chapters = await source.getChapters('b1');
    expect(chapters).toHaveLength(2);
  });

  test('getPages returns sorted image pages', async () => {
    const source = new ArchiveSource('/manga');
    source.registerBook('b1', 'Test Manga', {
      'ch1': ['page3.jpg', 'readme.txt', 'page1.jpg', 'page2.jpg'],
    });
    const pages = await source.getPages('ch1');
    expect(pages).toHaveLength(3);
    expect(pages[0].imageUri).toBe('page1.jpg');
    expect(pages[1].imageUri).toBe('page2.jpg');
    expect(pages[2].imageUri).toBe('page3.jpg');
  });
});
