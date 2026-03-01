import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import AnnotatedText, { TokenData } from './AnnotatedText';

interface LearningPanelProps {
  visible: boolean;
  japaneseTokens: TokenData[];
  chineseTranslation: string;
  onClose: () => void;
  onWordSave?: (token: TokenData) => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function LearningPanel({
  visible,
  japaneseTokens,
  chineseTranslation,
  onClose,
  onWordSave,
}: LearningPanelProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.panel}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>學習面板</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>日文原文</Text>
              <View style={styles.japaneseBox}>
                <AnnotatedText
                  tokens={japaneseTokens}
                  onTokenPress={onWordSave}
                />
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>中文翻譯</Text>
              <Text style={styles.translationText}>{chineseTranslation}</Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  panel: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: SCREEN_HEIGHT * 0.6,
    paddingBottom: 34,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  closeText: {
    fontSize: 20,
    color: '#666',
  },
  content: {
    paddingHorizontal: 20,
  },
  section: {
    paddingVertical: 16,
  },
  sectionLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  japaneseBox: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 8,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#e0e0e0',
  },
  translationText: {
    fontSize: 18,
    lineHeight: 28,
    color: '#333',
  },
});
