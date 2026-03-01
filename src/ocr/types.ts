export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TextRegion {
  text: string;
  boundingBox: BoundingBox;
  confidence: number;
}

export interface OCRResult {
  regions: TextRegion[];
  fullText: string;
}

export interface OCRProvider {
  name: string;
  recognize(imageUri: string): Promise<OCRResult>;
}
