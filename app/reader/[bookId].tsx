import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import MangaReader from '@/src/components/MangaReader';
import LearningPanel from '@/src/components/LearningPanel';
import { MangaPage } from '@/src/manga/types';
import { TokenData } from '@/src/components/AnnotatedText';
import { saveProgress } from '@/src/storage/progress';
import { saveWord } from '@/src/storage/progress';
import { runPipeline } from '@/src/services/pipeline';

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
  const [ocrLoading, setOcrLoading] = useState(false);

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
      setOcrLoading(true);
      try {
        const result = await runPipeline(page.imageUri);
        setPanelTokens(result.tokens);
        setPanelTranslation(result.translation);
        setPanelVisible(true);
      } catch (err) {
        Alert.alert('OCR 失敗', '無法辨識文字，請確認伺服器是否啟動。');
      } finally {
        setOcrLoading(false);
      }
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
      {ocrLoading && (
        <View style={styles.ocrOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.ocrLoadingText}>辨識中...</Text>
        </View>
      )}
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
  ocrOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ocrLoadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#fff',
  },
});
