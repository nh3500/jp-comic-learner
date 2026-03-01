import { Platform } from 'react-native';
import { OCRProvider, OCRResult, TextRegion } from '../types';

export class VisionKitProvider implements OCRProvider {
  name = 'VisionKit';

  async recognize(imageUri: string): Promise<OCRResult> {
    if (Platform.OS !== 'ios') {
      throw new Error('VisionKit is only available on iOS');
    }

    // Dynamic import to avoid crash on non-iOS platforms
    const VisionOCR = (await import('../../../modules/vision-ocr')).default;
    const rawResults = await VisionOCR.recognizeText(imageUri);

    const regions: TextRegion[] = rawResults.map((r) => ({
      text: r.text,
      boundingBox: {
        x: r.x,
        y: r.y,
        width: r.width,
        height: r.height,
      },
      confidence: r.confidence,
    }));

    const fullText = regions.map((r) => r.text).join('\n');

    return { regions, fullText };
  }
}
