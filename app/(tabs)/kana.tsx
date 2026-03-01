import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import KanaQuiz from '@/src/components/KanaQuiz';
import { HIRAGANA, KATAKANA } from '@/src/data/kana';

type KanaMode = 'select' | 'hiragana' | 'katakana';

export default function KanaScreen() {
  const [mode, setMode] = useState<KanaMode>('select');

  if (mode === 'hiragana') {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => setMode('select')}>
          <Text style={styles.backText}>← 返回</Text>
        </TouchableOpacity>
        <KanaQuiz kanaSet={HIRAGANA} title="平假名" />
      </SafeAreaView>
    );
  }

  if (mode === 'katakana') {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => setMode('select')}>
          <Text style={styles.backText}>← 返回</Text>
        </TouchableOpacity>
        <KanaQuiz kanaSet={KATAKANA} title="片假名" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.selectContainer}>
        <Text style={styles.title}>50音學習</Text>
        <Text style={styles.subtitle}>選擇練習模式</Text>
        <TouchableOpacity
          style={styles.modeButton}
          onPress={() => setMode('hiragana')}
        >
          <Text style={styles.modeButtonText}>平假名 (あ い う)</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.modeButton}
          onPress={() => setMode('katakana')}
        >
          <Text style={styles.modeButtonText}>片假名 (ア イ ウ)</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  selectContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  modeButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    minWidth: 250,
    alignItems: 'center',
  },
  modeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    padding: 16,
  },
  backText: {
    fontSize: 16,
    color: '#2196F3',
  },
});
