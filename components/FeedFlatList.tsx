import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, RefreshControl } from 'react-native';
import { FeedItem } from './FeedItem';
import { generateFlatListData } from '@/utils/generateFlatListData';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

/**
 * FeedFlatList displays a scrollable list of events
 * Features:
 * - Pull-to-refresh functionality
 * - Themed colors for light/dark mode
 * - Event item interaction
 */
export function FeedFlatList() {
  const [data, setData] = useState(() => generateFlatListData());
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  /**
   * Handles the pull-to-refresh gesture
   * Updates the feed with fresh data
   */
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    const newData = generateFlatListData();
    setData(newData);
    setRefreshing(false);
  }, []);

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => (
        <FeedItem 
          item={item} 
          onPress={() => console.log('Selected event:', item.title)}
        />
      )}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.text}
        />
      }
      keyExtractor={(item, index) => `${item.title}-${index}`}
      style={[styles.list, { backgroundColor: colors.background }]}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
});