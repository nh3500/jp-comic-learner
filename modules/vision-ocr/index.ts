import { requireNativeModule } from 'expo-modules-core';

interface TextRegionRaw {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
}

interface VisionOCRModuleType {
  recognizeText(imageUri: string): Promise<TextRegionRaw[]>;
}

const VisionOCR: VisionOCRModuleType = requireNativeModule('VisionOCR');

export default VisionOCR;
export type { TextRegionRaw };
