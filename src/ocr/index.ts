import { Platform } from 'react-native';
import { OCRProvider, OCRResult } from './types';
import { VisionKitProvider } from './providers/visionkit';

let currentProvider: OCRProvider | null = null;

export function getOCRProvider(): OCRProvider {
  if (!currentProvider) {
    if (Platform.OS === 'ios') {
      currentProvider = new VisionKitProvider();
    } else {
      throw new Error('No OCR provider available for this platform');
    }
  }
  return currentProvider;
}

export function setOCRProvider(provider: OCRProvider) {
  currentProvider = provider;
}

export async function recognizeText(imageUri: string): Promise<OCRResult> {
  const provider = getOCRProvider();
  return provider.recognize(imageUri);
}

export type { OCRProvider, OCRResult, TextRegion } from './types';
