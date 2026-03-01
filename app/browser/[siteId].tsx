import React, { useRef, useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useLocalSearchParams, Stack } from 'expo-router';
import { JAPANESE_MANGA_SITES } from '@/src/manga/sources/japanese-sites';
import LearningPanel from '@/src/components/LearningPanel';
import { TokenData } from '@/src/components/AnnotatedText';
import { saveWord } from '@/src/storage/progress';

export default function BrowserScreen() {
  const { siteId } = useLocalSearchParams<{ siteId: string }>();
  const webViewRef = useRef<WebView>(null);

  const site = JAPANESE_MANGA_SITES.find((s) => s.id === siteId);
  const [loading, setLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);

  // Learning panel state
  const [panelVisible, setPanelVisible] = useState(false);
  const [panelTokens, setPanelTokens] = useState<TokenData[]>([]);
  const [panelTranslation, setPanelTranslation] = useState('');

  const handleOCR = useCallback(async () => {
    // TODO: Capture WebView screenshot → OCR → Tokenize → Translate
    // For now, show a demo to prove the pipeline works
    const demoTokens: TokenData[] = [
      { surface: '読', reading: 'よ', pos: '動詞', basic: '読む' },
      { surface: 'み', reading: 'み', pos: '動詞', basic: '読む' },
      { surface: 'たい', reading: 'タイ', pos: '助動詞', basic: 'たい' },
      { surface: '漫画', reading: 'まんが', pos: '名詞', basic: '漫画' },
      { surface: 'を', reading: 'ヲ', pos: '助詞', basic: 'を' },
      { surface: '選', reading: 'えら', pos: '動詞', basic: '選ぶ' },
      { surface: 'ん', reading: 'ン', pos: '動詞', basic: '選ぶ' },
      { surface: 'で', reading: 'デ', pos: '助詞', basic: 'で' },
      { surface: 'ください', reading: 'クダサイ', pos: '動詞', basic: 'くださる' },
    ];
    setPanelTokens(demoTokens);
    setPanelTranslation('請選擇想讀的漫畫');
    setPanelVisible(true);
  }, []);

  const handleWordSave = useCallback(async (token: TokenData) => {
    await saveWord({
      surface: token.surface,
      reading: token.reading,
      meaning: token.basic,
    });
  }, []);

  if (!site) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>找不到該漫畫平台</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: site.name, headerBackTitle: '返回' }} />
      <View style={styles.container}>
        <WebView
          ref={webViewRef}
          source={{ uri: site.url }}
          style={styles.webview}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          onNavigationStateChange={(navState) => {
            setCanGoBack(navState.canGoBack);
          }}
          javaScriptEnabled
          domStorageEnabled
          allowsInlineMediaPlayback
          startInLoadingState
        />

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#2196F3" />
          </View>
        )}

        {/* Toolbar */}
        <View style={styles.toolbar}>
          <TouchableOpacity
            style={[styles.toolButton, !canGoBack && styles.toolButtonDisabled]}
            onPress={() => webViewRef.current?.goBack()}
            disabled={!canGoBack}
          >
            <Text style={[styles.toolButtonText, !canGoBack && styles.toolButtonTextDisabled]}>
              {'<'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toolButton}
            onPress={() => webViewRef.current?.reload()}
          >
            <Text style={styles.toolButtonText}>↻</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.ocrButton} onPress={handleOCR}>
            <Text style={styles.ocrButtonText}>OCR 辨識</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toolButton}
            onPress={() => webViewRef.current?.goForward()}
          >
            <Text style={styles.toolButtonText}>{'>'}</Text>
          </TouchableOpacity>
        </View>

        <LearningPanel
          visible={panelVisible}
          japaneseTokens={panelTokens}
          chineseTranslation={panelTranslation}
          onClose={() => setPanelVisible(false)}
          onWordSave={handleWordSave}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8f8f8',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ddd',
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
  },
  toolButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eee',
  },
  toolButtonDisabled: {
    opacity: 0.4,
  },
  toolButtonText: {
    fontSize: 20,
    color: '#333',
  },
  toolButtonTextDisabled: {
    color: '#999',
  },
  ocrButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#2196F3',
  },
  ocrButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#F44336',
  },
});
