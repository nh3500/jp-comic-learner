import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { pickArchive } from '@/src/manga/importManga';

interface LibraryItem {
  id: string;
  title: string;
  source: 'archive' | 'manhuaren';
  uri: string;
}

export default function LibraryScreen() {
  const [items, setItems] = useState<LibraryItem[]>([]);

  const handleImport = useCallback(async () => {
    try {
      const uri = await pickArchive();
      if (!uri) return;

      const filename = uri.split('/').pop() || 'Unknown';
      const title = filename.replace(/\.(zip|cbz|cbr|rar)$/i, '');

      const newItem: LibraryItem = {
        id: Date.now().toString(),
        title,
        source: 'archive',
        uri,
      };

      setItems((prev) => [...prev, newItem]);
    } catch (error) {
      Alert.alert('匯入失敗', '無法匯入此檔案，請確認格式是否正確。');
    }
  }, []);

  const handleItemPress = useCallback((item: LibraryItem) => {
    router.push({
      pathname: '/reader/[bookId]',
      params: { bookId: item.id, uri: item.uri, title: item.title },
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📚</Text>
          <Text style={styles.emptyTitle}>漫畫庫是空的</Text>
          <Text style={styles.emptySubtitle}>匯入壓縮檔開始學習</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => handleItemPress(item)}
            >
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemSource}>
                {item.source === 'archive' ? '本地匯入' : '漫畫人'}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
      <TouchableOpacity style={styles.fab} onPress={handleImport}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
  },
  list: {
    padding: 16,
  },
  item: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemSource: {
    fontSize: 12,
    color: '#999',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  fabText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '300',
    marginTop: -2,
  },
});
