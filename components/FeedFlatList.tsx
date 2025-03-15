import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, RefreshControl } from 'react-native';
import { FeedItem } from './FeedItem';
import { getFeedData } from '@/mockdb/mockApis';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { MomentData } from '@/types/feed';

/**
 * FeedFlatList displays a scrollable list of events
 * Features:
 * - Pull-to-refresh functionality
 * - Themed colors for light/dark mode
 * - Event item interaction
 */
export function FeedFlatList() {
  const [data, setData] = useState(() => getFeedData());
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  /**
   * Handles the pull-to-refresh gesture
   * Updates the feed with fresh data
   */
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    const newData = getFeedData();
    setData(newData);
    setRefreshing(false);
  }, []);

  const handleFeedItemPress = useCallback((momentData: MomentData) => {
    console.log('FeedItem pressed. Metadata:', momentData.metadata);
    router.push({
      pathname: '/moment' as const,
      params: {
        title: momentData.title,
        description: momentData.description || '',
        host: momentData.host.username,
        metadata: JSON.stringify(momentData.metadata),
      },
    });
  }, [router]);

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => (
        <FeedItem 
          item={item} 
          onPress={handleFeedItemPress}
        />
      )}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.text}
        />
      }
      keyExtractor={(item) => item.id}
      style={[styles.list, { backgroundColor: colors.background }]}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
});