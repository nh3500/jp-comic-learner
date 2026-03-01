import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity } from 'react-native';
import PagerView from 'react-native-pager-view';
import { Image } from 'expo-image';
import { MangaPage } from '../manga/types';

interface MangaReaderProps {
  pages: MangaPage[];
  initialPage?: number;
  onPageChange?: (pageNumber: number) => void;
  onRegionTap?: (page: MangaPage) => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function MangaReader({
  pages,
  initialPage = 0,
  onPageChange,
  onRegionTap,
}: MangaReaderProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const handlePageSelected = useCallback(
    (e: { nativeEvent: { position: number } }) => {
      const position = e.nativeEvent.position;
      setCurrentPage(position);
      onPageChange?.(position + 1);
    },
    [onPageChange],
  );

  if (pages.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>沒有頁面</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PagerView
        style={styles.pager}
        initialPage={initialPage}
        onPageSelected={handlePageSelected}
      >
        {pages.map((page) => (
          <TouchableOpacity
            key={page.id}
            style={styles.pageContainer}
            activeOpacity={0.9}
            onPress={() => onRegionTap?.(page)}
          >
            <Image
              source={{ uri: page.imageUri }}
              style={styles.pageImage}
              contentFit="contain"
              transition={200}
            />
          </TouchableOpacity>
        ))}
      </PagerView>
      <View style={styles.pageIndicator}>
        <Text style={styles.pageText}>
          {currentPage + 1} / {pages.length}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  pager: {
    flex: 1,
  },
  pageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - 100,
  },
  pageIndicator: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  pageText: {
    color: '#fff',
    fontSize: 14,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    overflow: 'hidden',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});
