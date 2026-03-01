import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import MangaReader from '@/src/components/MangaReader';
import LearningPanel from '@/src/components/LearningPanel';
import { MangaPage } from '@/src/manga/types';
import { TokenData } from '@/src/components/AnnotatedText';
import { saveProgress } from '@/src/storage/progress';
import { saveWord } from '@/src/storage/progress';
import { translate } from '@/src/services/translate';

export default function ReaderScreen() {
  const { bookId, uri, title } = useLocalSearchParams<{
    bookId: string;
    uri: string;
    title: string;
  }>();

  const [pages, setPages] = useState<MangaPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Learning panel state
  const [panelVisible, setPanelVisible] = useState(false);
  const [panelTokens, setPanelTokens] = useState<TokenData[]>([]);
  const [panelTranslation, setPanelTranslation] = useState('');

  useEffect(() => {
    loadPages();
  }, [uri]);

  async function loadPages() {
    try {
      setLoading(true);
      // For now, treat URI as a directory of images or a single image
      // Full archive extraction will be integrated later
      if (uri) {
        const info = await FileSystem.getInfoAsync(uri);
        if (info.exists) {
          setPages([
            {
              id: `${bookId}-0`,
              imageUri: uri,
              pageNumber: 1,
            },
          ]);
        } else {
          setError('找不到檔案');
        }
      }
    } catch (e) {
      setError('載入失敗');
    } finally {
      setLoading(false);
    }
  }

  const handlePageChange = useCallback(
    (pageNumber: number) => {
      if (bookId) {
        saveProgress(bookId, 'default', pageNumber);
      }
    },
    [bookId],
  );

  const handleRegionTap = useCallback(
    async (page: MangaPage) => {
      // TODO: In the future, this will:
      // 1. Run OCR on the tapped region
      // 2. Tokenize the recognized text
      // 3. Translate it
      // For now, show a demo panel
      const demoTokens: TokenData[] = [
        { surface: '俺', reading: 'オレ', pos: '名詞', basic: '俺' },
        { surface: 'は', reading: 'ハ', pos: '助詞', basic: 'は' },
        { surface: '海賊王', reading: 'カイゾクオウ', pos: '名詞', basic: '海賊王' },
        { surface: 'に', reading: 'ニ', pos: '助詞', basic: 'に' },
        { surface: 'なる', reading: 'ナル', pos: '動詞', basic: 'なる' },
      ];
      setPanelTokens(demoTokens);
      setPanelTranslation('我要成為海賊王');
      setPanelVisible(true);
    },
    [],
  );

  const handleWordSave = useCallback(async (token: TokenData) => {
    await saveWord({
      surface: token.surface,
      reading: token.reading,
      meaning: token.basic,
    });
  }, []);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>載入中...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MangaReader
        pages={pages}
        onPageChange={handlePageChange}
        onRegionTap={handleRegionTap}
      />
      <LearningPanel
        visible={panelVisible}
        japaneseTokens={panelTokens}
        chineseTranslation={panelTranslation}
        onClose={() => setPanelVisible(false)}
        onWordSave={handleWordSave}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#F44336',
  },
});
