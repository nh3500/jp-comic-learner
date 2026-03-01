import { OCRProvider, OCRResult, TextRegion } from '../types';

describe('OCR types', () => {
  test('OCRProvider interface is usable', () => {
    const mockProvider: OCRProvider = {
      name: 'mock',
      recognize: async (_imageUri: string): Promise<OCRResult> => ({
        regions: [],
        fullText: '',
      }),
    };
    expect(mockProvider.name).toBe('mock');
  });

  test('TextRegion has correct shape', () => {
    const region: TextRegion = {
      text: 'こんにちは',
      boundingBox: { x: 10, y: 20, width: 100, height: 30 },
      confidence: 0.95,
    };
    expect(region.text).toBe('こんにちは');
    expect(region.boundingBox.x).toBe(10);
    expect(region.confidence).toBeGreaterThan(0.9);
  });

  test('OCRResult contains regions and fullText', () => {
    const result: OCRResult = {
      regions: [
        {
          text: 'テスト',
          boundingBox: { x: 0, y: 0, width: 50, height: 20 },
          confidence: 0.99,
        },
      ],
      fullText: 'テスト',
    };
    expect(result.regions).toHaveLength(1);
    expect(result.fullText).toBe('テスト');
  });
});
