import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  SectionList,
} from 'react-native';
import { router } from 'expo-router';
import { pickArchive } from '@/src/manga/importManga';
import {
  JAPANESE_MANGA_SITES,
  JapaneseMangaSite,
} from '@/src/manga/sources/japanese-sites';

interface LibraryItem {
  id: string;
  title: string;
  source: 'archive' | 'webview';
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

  const handleSitePress = useCallback((site: JapaneseMangaSite) => {
    router.push({
      pathname: '/browser/[siteId]',
      params: { siteId: site.id },
    });
  }, []);

  const freeModelLabel = (model: JapaneseMangaSite['freeModel']) => {
    switch (model) {
      case 'free':
        return '免費';
      case 'first-read-free':
        return '初回免費';
      case 'partial-free':
        return '部分免費';
    }
  };

  const freeModelColor = (model: JapaneseMangaSite['freeModel']) => {
    switch (model) {
      case 'free':
        return '#4CAF50';
      case 'first-read-free':
        return '#FF9800';
      case 'partial-free':
        return '#9E9E9E';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <SectionList
        sections={[
          {
            title: '日漫來源',
            data: JAPANESE_MANGA_SITES,
            type: 'sites' as const,
          },
          {
            title: '本地漫畫',
            data: items.length > 0 ? items : [],
            type: 'local' as const,
          },
        ]}
        keyExtractor={(item: any) => item.id}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.title === '日漫來源' && (
              <Text style={styles.sectionSubtitle}>
                瀏覽日文原版漫畫，搭配 OCR 學習
              </Text>
            )}
          </View>
        )}
        renderItem={({ item, section }) => {
          if ((section as any).type === 'sites') {
            const site = item as unknown as JapaneseMangaSite;
            return (
              <TouchableOpacity
                style={styles.siteItem}
                onPress={() => handleSitePress(site)}
              >
                <View style={styles.siteIcon}>
                  <Text style={styles.siteIconText}>{site.icon}</Text>
                </View>
                <View style={styles.siteInfo}>
                  <View style={styles.siteNameRow}>
                    <Text style={styles.siteName}>{site.name}</Text>
                    <View
                      style={[
                        styles.freeTag,
                        { backgroundColor: freeModelColor(site.freeModel) },
                      ]}
                    >
                      <Text style={styles.freeTagText}>
                        {freeModelLabel(site.freeModel)}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.sitePublisher}>{site.publisher}</Text>
                  <Text style={styles.siteDesc} numberOfLines={1}>
                    {site.description}
                  </Text>
                </View>
                <Text style={styles.chevron}>{'>'}</Text>
              </TouchableOpacity>
            );
          }

          const localItem = item as unknown as LibraryItem;
          return (
            <TouchableOpacity
              style={styles.localItem}
              onPress={() => handleItemPress(localItem)}
            >
              <Text style={styles.localItemTitle}>{localItem.title}</Text>
              <Text style={styles.localItemSource}>本地匯入</Text>
            </TouchableOpacity>
          );
        }}
        ListFooterComponent={
          items.length === 0 ? (
            <View style={styles.emptyLocal}>
              <Text style={styles.emptyLocalText}>
                尚未匯入本地漫畫。點擊右下角 + 匯入壓縮檔。
              </Text>
            </View>
          ) : null
        }
        stickySectionHeadersEnabled={false}
      />

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
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  // Site items
  siteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  siteIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  siteIconText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1976D2',
  },
  siteInfo: {
    flex: 1,
  },
  siteNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  siteName: {
    fontSize: 15,
    fontWeight: '600',
  },
  freeTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  freeTagText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  sitePublisher: {
    fontSize: 12,
    color: '#666',
    marginTop: 1,
  },
  siteDesc: {
    fontSize: 11,
    color: '#999',
    marginTop: 1,
  },
  chevron: {
    fontSize: 16,
    color: '#ccc',
    marginLeft: 8,
  },
  // Local items
  localItem: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  localItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  localItemSource: {
    fontSize: 12,
    color: '#999',
  },
  emptyLocal: {
    padding: 24,
    alignItems: 'center',
  },
  emptyLocalText: {
    fontSize: 13,
    color: '#bbb',
    textAlign: 'center',
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
