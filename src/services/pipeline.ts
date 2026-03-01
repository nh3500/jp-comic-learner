import { recognizeText, OCRResult } from '../ocr';
import { translate } from './translate';
import { TokenData } from '../components/AnnotatedText';

const TOKENIZER_URL = __DEV__
  ? 'http://localhost:3001'
  : 'http://localhost:3001'; // TODO: production URL

export interface PipelineResult {
  ocrText: string;
  tokens: TokenData[];
  translation: string;
  regions: OCRResult['regions'];
}

async function tokenize(text: string): Promise<TokenData[]> {
  try {
    const response = await fetch(`${TOKENIZER_URL}/tokenize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`Tokenizer error: ${response.status}`);
    }

    const data = await response.json();
    return data.tokens;
  } catch (error) {
    // Fallback: return each character as a token
    return text.split('').map((char) => ({
      surface: char,
      reading: '',
      pos: '未知',
      basic: char,
    }));
  }
}

export async function runPipeline(imageUri: string): Promise<PipelineResult> {
  // Step 1: OCR
  const ocrResult = await recognizeText(imageUri);

  if (!ocrResult.fullText.trim()) {
    return {
      ocrText: '',
      tokens: [],
      translation: '（未偵測到文字）',
      regions: [],
    };
  }

  // Step 2 & 3: Tokenize and Translate in parallel
  const [tokens, translation] = await Promise.all([
    tokenize(ocrResult.fullText),
    translate(ocrResult.fullText, 'ja', 'zh'),
  ]);

  return {
    ocrText: ocrResult.fullText,
    tokens,
    translation,
    regions: ocrResult.regions,
  };
}

export async function runPipelineFromText(text: string): Promise<Omit<PipelineResult, 'regions'>> {
  if (!text.trim()) {
    return {
      ocrText: '',
      tokens: [],
      translation: '（無文字）',
    };
  }

  const [tokens, translation] = await Promise.all([
    tokenize(text),
    translate(text, 'ja', 'zh'),
  ]);

  return {
    ocrText: text,
    tokens,
    translation,
  };
}
