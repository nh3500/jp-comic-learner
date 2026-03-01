# JP Comic Learner MVP Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 建立一個手機 App，讓零基礎用戶透過重讀熟悉的日本漫畫學習日文，支援壓縮檔匯入和漫畫平台下載。

**Architecture:** React Native + Expo 前端，搭配輕量後端處理日文分詞。漫畫輸入透過抽象的 MangaSource 介面支援多種來源（壓縮檔、截圖、漫畫人下載器）。OCR 優先使用 Apple VisionKit 原生模組，學習層以 overlay 形式疊加在漫畫閱讀器上。

**Tech Stack:**
- React Native + Expo (SDK 52+)
- expo-router (導航)
- expo-document-picker + expo-file-system (檔案處理)
- react-native-zip-archive (壓縮檔解壓)
- react-native-pager-view + expo-image (漫畫閱讀器)
- Apple VisionKit via Expo Module (OCR)
- kuromoji.js on lightweight Express server (日文分詞)
- DeepL API (翻譯) + Jisho API (辭典)

---

## Phase 1: Project Scaffolding

### Task 1: Initialize Expo Project

**Files:**
- Create: project root via `npx create-expo-app`
- Create: `app/_layout.tsx` (root layout)
- Create: `app/(tabs)/_layout.tsx` (tab navigation)
- Create: `app/(tabs)/index.tsx` (home screen)
- Create: `app/(tabs)/kana.tsx` (50音 tab)
- Create: `app/(tabs)/library.tsx` (漫畫庫 tab)

**Step 1: Create Expo project**

```bash
npx create-expo-app@latest jp-comic-learner --template tabs
```

**Step 2: Install core dependencies**

```bash
npx expo install expo-document-picker expo-file-system expo-image react-native-pager-view react-native-gesture-handler react-native-zip-archive
```

**Step 3: Verify project runs**

```bash
npx expo start --ios
```
Expected: App launches on iOS simulator with tab navigation.

**Step 4: Set up basic tab structure**

Replace default tabs with three tabs:
- Home (首頁)
- Kana (50音)
- Library (漫畫庫)

**Step 5: Commit**

```bash
git add -A && git commit -m "feat: initialize Expo project with tab navigation"
```

---

## Phase 2: 50音 Learning Module

### Task 2: Kana Data Model

**Files:**
- Create: `src/data/kana.ts`
- Create: `src/data/__tests__/kana.test.ts`

**Step 1: Write test for kana data structure**

```typescript
// src/data/__tests__/kana.test.ts
import { HIRAGANA, KATAKANA, KanaChar } from '../kana';

describe('Kana Data', () => {
  test('hiragana contains 46 basic characters', () => {
    expect(HIRAGANA.length).toBe(46);
  });

  test('katakana contains 46 basic characters', () => {
    expect(KATAKANA.length).toBe(46);
  });

  test('each kana has char, romaji, and row', () => {
    const first = HIRAGANA[0];
    expect(first).toHaveProperty('char');
    expect(first).toHaveProperty('romaji');
    expect(first).toHaveProperty('row');
  });
});
```

**Step 2: Run test to verify it fails**

```bash
npx jest src/data/__tests__/kana.test.ts
```
Expected: FAIL — module not found.

**Step 3: Implement kana data**

```typescript
// src/data/kana.ts
export interface KanaChar {
  char: string;
  romaji: string;
  row: string; // e.g. 'a', 'ka', 'sa'...
}

export const HIRAGANA: KanaChar[] = [
  { char: 'あ', romaji: 'a', row: 'a' },
  { char: 'い', romaji: 'i', row: 'a' },
  { char: 'う', romaji: 'u', row: 'a' },
  { char: 'え', romaji: 'e', row: 'a' },
  { char: 'お', romaji: 'o', row: 'a' },
  // ... complete 46 characters
];

export const KATAKANA: KanaChar[] = [
  { char: 'ア', romaji: 'a', row: 'a' },
  // ... complete 46 characters
];
```

**Step 4: Run tests**

```bash
npx jest src/data/__tests__/kana.test.ts
```
Expected: PASS

**Step 5: Commit**

```bash
git add src/data/ && git commit -m "feat: add kana data model with hiragana and katakana"
```

### Task 3: Kana Quiz Component

**Files:**
- Create: `src/components/KanaQuiz.tsx`
- Create: `src/components/__tests__/KanaQuiz.test.tsx`
- Modify: `app/(tabs)/kana.tsx`

**Step 1: Write test for quiz logic**

```typescript
// src/components/__tests__/KanaQuiz.test.tsx
import { getQuizQuestion, checkAnswer } from '../KanaQuiz';
import { HIRAGANA } from '../../data/kana';

describe('KanaQuiz', () => {
  test('getQuizQuestion returns a kana with 4 choices', () => {
    const question = getQuizQuestion(HIRAGANA);
    expect(question.target).toBeDefined();
    expect(question.choices).toHaveLength(4);
    expect(question.choices).toContain(question.target.romaji);
  });

  test('checkAnswer returns true for correct answer', () => {
    const target = HIRAGANA[0]; // あ = a
    expect(checkAnswer(target, 'a')).toBe(true);
  });

  test('checkAnswer returns false for wrong answer', () => {
    const target = HIRAGANA[0]; // あ = a
    expect(checkAnswer(target, 'ka')).toBe(false);
  });
});
```

**Step 2: Run test to verify it fails**

```bash
npx jest src/components/__tests__/KanaQuiz.test.tsx
```

**Step 3: Implement quiz logic and component**

Implement `getQuizQuestion()` — randomly picks a kana, generates 4 choices (1 correct + 3 random).
Implement `checkAnswer()` — compares selected romaji with target.
Implement `<KanaQuiz />` — displays large kana character + 4 romaji buttons.

**Step 4: Run tests**

```bash
npx jest src/components/__tests__/KanaQuiz.test.tsx
```
Expected: PASS

**Step 5: Wire up to kana tab**

Integrate `<KanaQuiz />` into `app/(tabs)/kana.tsx`.

**Step 6: Commit**

```bash
git add src/components/ app/ && git commit -m "feat: add kana quiz component with multiple choice"
```

---

## Phase 3: Manga Source Abstraction & Archive Import

### Task 4: MangaSource Interface

**Files:**
- Create: `src/manga/types.ts`
- Create: `src/manga/__tests__/types.test.ts`

**Step 1: Write test for type definitions**

```typescript
// src/manga/__tests__/types.test.ts
import { MangaSource, MangaBook, MangaChapter, MangaPage } from '../types';

describe('MangaSource types', () => {
  test('MangaSource interface is importable', () => {
    // Type-level test, verifies compilation
    const mockSource: MangaSource = {
      name: 'test',
      getBooks: async () => [],
      getChapters: async (_bookId: string) => [],
      getPages: async (_chapterId: string) => [],
    };
    expect(mockSource.name).toBe('test');
  });
});
```

**Step 2: Run test to verify it fails**

```bash
npx jest src/manga/__tests__/types.test.ts
```

**Step 3: Implement types**

```typescript
// src/manga/types.ts
export interface MangaPage {
  id: string;
  imageUri: string; // local file URI
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
```

**Step 4: Run tests**

```bash
npx jest src/manga/__tests__/types.test.ts
```
Expected: PASS

**Step 5: Commit**

```bash
git add src/manga/ && git commit -m "feat: define MangaSource interface and types"
```

### Task 5: Archive Source Adapter

**Files:**
- Create: `src/manga/sources/archive.ts`
- Create: `src/manga/sources/__tests__/archive.test.ts`

**Step 1: Write test for archive extraction**

```typescript
// src/manga/sources/__tests__/archive.test.ts
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
});
```

**Step 2: Run test to verify it fails**

**Step 3: Implement ArchiveSource**

Key logic:
- `filterImageFiles()`: keep only jpg/png/webp/gif
- `sortPages()`: natural sort (page2 before page10)
- `importArchive(uri)`: use react-native-zip-archive to extract, return MangaBook
- `getPages()`: list extracted images as MangaPage[]

**Step 4: Run tests, verify PASS**

**Step 5: Commit**

```bash
git commit -m "feat: add ArchiveSource adapter for ZIP/CBZ import"
```

### Task 6: File Picker Integration

**Files:**
- Create: `src/manga/importManga.ts`
- Modify: `app/(tabs)/library.tsx`

**Step 1: Implement file picker flow**

```typescript
// src/manga/importManga.ts
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { ArchiveSource } from './sources/archive';

export async function pickAndImportArchive(): Promise<string | null> {
  const result = await DocumentPicker.getDocumentAsync({
    type: ['application/zip', 'application/x-cbz', 'application/x-rar-compressed'],
  });

  if (result.canceled) return null;

  const file = result.assets[0];
  const destDir = `${FileSystem.documentDirectory}manga/`;
  // Extract and return book ID
  return ArchiveSource.importArchive(file.uri, destDir);
}
```

**Step 2: Add import button to library tab**

Library tab shows list of imported manga + "Import" FAB button.

**Step 3: Test manually on iOS simulator**

**Step 4: Commit**

```bash
git commit -m "feat: add file picker and archive import to library"
```

---

## Phase 4: Manga Reader

### Task 7: Page Viewer Component

**Files:**
- Create: `src/components/MangaReader.tsx`
- Create: `app/reader/[bookId].tsx`

**Step 1: Build basic page viewer**

Use `react-native-pager-view` for horizontal page swipe.
Use `expo-image` for efficient image rendering.

```typescript
// src/components/MangaReader.tsx
// Core: PagerView wrapping Image components
// Features: swipe left/right, page indicator, pinch-to-zoom
```

**Step 2: Create reader route**

`app/reader/[bookId].tsx` — loads pages from MangaSource, renders MangaReader.

**Step 3: Test on simulator with sample images**

**Step 4: Commit**

```bash
git commit -m "feat: add manga reader with page swipe navigation"
```

---

## Phase 5: OCR Pipeline

### Task 8: OCR Provider Interface

**Files:**
- Create: `src/ocr/types.ts`
- Create: `src/ocr/__tests__/types.test.ts`

**Step 1: Define OCR interface**

```typescript
// src/ocr/types.ts
export interface TextRegion {
  text: string;
  boundingBox: { x: number; y: number; width: number; height: number };
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
```

**Step 2: Write type tests, verify pass**

**Step 3: Commit**

```bash
git commit -m "feat: define OCR provider interface"
```

### Task 9: Apple VisionKit Native Module

**Files:**
- Create: `modules/vision-ocr/` (Expo Module)
- Create: `modules/vision-ocr/ios/VisionOCRModule.swift`
- Create: `modules/vision-ocr/index.ts`
- Create: `src/ocr/providers/visionkit.ts`

**Step 1: Create Expo Module scaffold**

```bash
npx create-expo-module@latest vision-ocr --local
```

**Step 2: Implement Swift native code**

```swift
// modules/vision-ocr/ios/VisionOCRModule.swift
import Vision
import ExpoModulesCore

public class VisionOCRModule: Module {
  public func definition() -> ModuleDefinition {
    Name("VisionOCR")

    AsyncFunction("recognizeText") { (imageUri: String) -> [[String: Any]] in
      // Load image from URI
      // Create VNRecognizeTextRequest with .japanese
      // Return array of { text, x, y, width, height, confidence }
    }
  }
}
```

**Step 3: Create TypeScript wrapper**

```typescript
// src/ocr/providers/visionkit.ts
import VisionOCR from '../../modules/vision-ocr';
import { OCRProvider, OCRResult } from '../types';

export class VisionKitProvider implements OCRProvider {
  name = 'VisionKit';
  async recognize(imageUri: string): Promise<OCRResult> {
    const raw = await VisionOCR.recognizeText(imageUri);
    // Transform to OCRResult
  }
}
```

**Step 4: Test on real device** (VisionKit requires physical device)

**Step 5: Commit**

```bash
git commit -m "feat: add VisionKit OCR native module for Japanese text"
```

---

## Phase 6: Text Processing

### Task 10: Tokenization Server

**Files:**
- Create: `server/package.json`
- Create: `server/index.ts`
- Create: `server/__tests__/tokenize.test.ts`

**Step 1: Write test for tokenization endpoint**

```typescript
// server/__tests__/tokenize.test.ts
import request from 'supertest';
import app from '../index';

describe('POST /tokenize', () => {
  test('tokenizes Japanese sentence', async () => {
    const res = await request(app)
      .post('/tokenize')
      .send({ text: '今日はいい天気ですね' });

    expect(res.status).toBe(200);
    expect(res.body.tokens).toBeInstanceOf(Array);
    expect(res.body.tokens[0]).toHaveProperty('surface');
    expect(res.body.tokens[0]).toHaveProperty('reading');
    expect(res.body.tokens[0]).toHaveProperty('pos'); // part of speech
  });
});
```

**Step 2: Run test to verify it fails**

**Step 3: Implement server**

```typescript
// server/index.ts
import express from 'express';
import kuromoji from 'kuromoji';

const app = express();
app.use(express.json());

let tokenizer: kuromoji.Tokenizer<kuromoji.IpadicFeatures>;

kuromoji.builder({ dicPath: 'node_modules/kuromoji/dict/' }).build((err, t) => {
  tokenizer = t;
});

app.post('/tokenize', (req, res) => {
  const { text } = req.body;
  const tokens = tokenizer.tokenize(text).map(t => ({
    surface: t.surface_form,
    reading: t.reading,
    pos: t.pos,
    basic: t.basic_form,
  }));
  res.json({ tokens });
});

export default app;
```

**Step 4: Run tests, verify PASS**

**Step 5: Commit**

```bash
git commit -m "feat: add tokenization server with kuromoji"
```

### Task 11: Translation Service

**Files:**
- Create: `src/services/translate.ts`
- Create: `src/services/__tests__/translate.test.ts`

**Step 1: Write test**

```typescript
describe('TranslationService', () => {
  test('translates Japanese to Chinese', async () => {
    const result = await translate('今日はいい天気ですね', 'ja', 'zh');
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });
});
```

**Step 2: Implement using DeepL API**

Abstracted behind `TranslationProvider` interface, similar to OCR.

**Step 3: Run tests, verify PASS**

**Step 4: Commit**

```bash
git commit -m "feat: add translation service with DeepL"
```

---

## Phase 7: Learning Overlay

### Task 12: Text Annotation Component

**Files:**
- Create: `src/components/AnnotatedText.tsx`
- Create: `src/components/__tests__/AnnotatedText.test.tsx`

**Step 1: Write test**

Test that AnnotatedText renders tokens with furigana (reading) above each word.

**Step 2: Implement component**

Display each token as a vertical stack: reading on top, surface form below.
Tappable — tap a word to see dictionary entry.

**Step 3: Run tests, verify PASS**

**Step 4: Commit**

```bash
git commit -m "feat: add annotated text component with furigana"
```

### Task 13: Side-by-Side Learning Panel

**Files:**
- Create: `src/components/LearningPanel.tsx`
- Modify: `src/components/MangaReader.tsx`

**Step 1: Build learning panel**

Bottom sheet or side panel that shows:
- Left: Japanese text with furigana (AnnotatedText)
- Right: Chinese translation
- Triggered by tapping a detected text region on the manga page

**Step 2: Integrate with MangaReader**

When reader is in "learning mode":
- Show detected text regions as tappable overlays on the manga page
- Tapping a region opens the LearningPanel with that text

**Step 3: Manual test on simulator**

**Step 4: Commit**

```bash
git commit -m "feat: add side-by-side learning panel with JP/CN comparison"
```

---

## Phase 8: Manhuaren Source Adapter

### Task 14: Manhuaren Adapter

**Files:**
- Create: `src/manga/sources/manhuaren.ts`
- Create: `src/manga/sources/__tests__/manhuaren.test.ts`

**Step 1: Research manhuaren API endpoints**

Reference: https://github.com/k66inthesky/AutoDownloadManga
Study the API structure — typically:
- Search: keyword → manga list
- Chapters: manga ID → chapter list
- Pages: chapter ID → image URLs

**Step 2: Write tests with mocked responses**

```typescript
describe('ManhuarenSource', () => {
  test('search returns manga list', async () => {
    const source = new ManhuarenSource();
    const results = await source.search('ワンピース');
    expect(results).toBeInstanceOf(Array);
  });

  test('getChapters returns chapter list', async () => {
    const source = new ManhuarenSource();
    const chapters = await source.getChapters('mock-id');
    expect(chapters).toBeInstanceOf(Array);
  });
});
```

**Step 3: Implement adapter**

Implement `ManhuarenSource` conforming to `MangaSource` interface.
Add `search(query: string)` as an extension method for discovery.

**Step 4: Add search UI to library tab**

Search bar that searches via ManhuarenSource, displays results, tap to download chapters.

**Step 5: Run tests, verify PASS**

**Step 6: Commit**

```bash
git commit -m "feat: add Manhuaren source adapter with search"
```

---

## Phase 9: Lightweight Progress Tracking

### Task 15: Reading Progress Storage

**Files:**
- Create: `src/storage/progress.ts`
- Create: `src/storage/__tests__/progress.test.ts`

**Step 1: Write test**

```typescript
describe('ReadingProgress', () => {
  test('saves and loads last read page', async () => {
    await saveProgress('book-1', 'chapter-1', 15);
    const progress = await getProgress('book-1');
    expect(progress.chapterId).toBe('chapter-1');
    expect(progress.pageNumber).toBe(15);
  });

  test('saves looked-up words', async () => {
    await saveWord({ surface: '天気', reading: 'てんき', meaning: '天氣' });
    const words = await getWords();
    expect(words).toContainEqual(
      expect.objectContaining({ surface: '天気' })
    );
  });
});
```

**Step 2: Implement using AsyncStorage**

```bash
npx expo install @react-native-async-storage/async-storage
```

**Step 3: Run tests, verify PASS**

**Step 4: Commit**

```bash
git commit -m "feat: add lightweight reading progress and word tracking"
```

---

## Phase 10: Integration & End-to-End Flow

### Task 16: Wire Everything Together

**Files:**
- Modify: `app/(tabs)/library.tsx` — import button + manga list + search
- Modify: `app/reader/[bookId].tsx` — OCR + learning panel integration
- Create: `app/reader/[bookId]/[chapterId].tsx` — chapter reader route

**Step 1: Complete the reading flow**

1. User opens Library tab
2. Imports archive OR searches Manhuaren
3. Taps a manga → sees chapters
4. Taps chapter → MangaReader opens
5. Taps on text bubble → OCR runs → LearningPanel shows
6. Progress auto-saved

**Step 2: Manual end-to-end test**

Test with a real CBZ file containing Japanese manga pages.

**Step 3: Commit**

```bash
git commit -m "feat: complete end-to-end reading and learning flow"
```

---

## Summary

| Phase | Tasks | Description |
|-------|-------|-------------|
| 1 | Task 1 | Project scaffolding |
| 2 | Tasks 2-3 | 50音 learning module |
| 3 | Tasks 4-6 | Manga source abstraction + archive import |
| 4 | Task 7 | Manga reader |
| 5 | Tasks 8-9 | OCR pipeline |
| 6 | Tasks 10-11 | Text processing (tokenization + translation) |
| 7 | Tasks 12-13 | Learning overlay UI |
| 8 | Task 14 | Manhuaren source adapter |
| 9 | Task 15 | Progress tracking |
| 10 | Task 16 | Integration |
