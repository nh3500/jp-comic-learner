import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

const MANGA_DIR = `${FileSystem.documentDirectory}manga/`;

export async function ensureMangaDir(): Promise<void> {
  const info = await FileSystem.getInfoAsync(MANGA_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(MANGA_DIR, { intermediates: true });
  }
}

export async function pickArchive(): Promise<string | null> {
  const result = await DocumentPicker.getDocumentAsync({
    type: [
      'application/zip',
      'application/x-cbz',
      'application/x-cbr',
      'application/x-rar-compressed',
      'application/octet-stream',
    ],
    copyToCacheDirectory: true,
  });

  if (result.canceled || result.assets.length === 0) {
    return null;
  }

  return result.assets[0].uri;
}

export function getMangaDir(): string {
  return MANGA_DIR;
}
