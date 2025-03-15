import React, { useCallback, useState, useEffect } from 'react';
import { FlatList, StyleSheet, RefreshControl, View, Text, ActivityIndicator } from 'react-native';
import { FeedItem } from './FeedItem';
import { getFeedItems, getUser, getMoment, getRSVPCount } from '@/mockdb/mockApis';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { FeedItem as FeedItemType } from '@/types/feedItem';
import { rsvps } from '@/mockdb/mockRsvps';
import { RSVP } from '@/types/rsvp';

/**
 * FeedFlatList displays a scrollable list of moments
 * Features:
 * - Pull-to-refresh functionality
 * - Themed colors for light/dark mode
 * - Moment interaction
 * - Loading and error states
 */
export function FeedFlatList() {
  const [data, setData] = useState<FeedItemType[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  const loadFeedItems = useCallback(async () => {
    try {
      setError(null);
      const items = await getFeedItems();
      setData(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load feed');
      setData([]);
    }
  }, []);

  useEffect(() => {
    const initialLoad = async () => {
      setIsLoading(true);
      await loadFeedItems();
      setIsLoading(false);
    };
    initialLoad();
  }, [loadFeedItems]);

  /**
   * Handles the pull-to-refresh gesture
   * Updates the feed with fresh data
   */
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadFeedItems();
    setRefreshing(false);
  }, [loadFeedItems]);

  const handleFeedItemPress = useCallback((item: FeedItemType) => {
    const moment = getMoment(item.momentId);
    const host = getUser(item.userId);
    
    if (moment && host) {
      router.push({
        pathname: '/moment' as const,
        params: {
          title: moment.title,
          description: moment.description || '',
          host: `@${host.username}`,
          metadata: JSON.stringify({
            createdAt: moment.createdAt,
            going: getRSVPCount(moment.id),
            interested: rsvps.filter(r => r.momentId === moment.id && r.status === 'maybe').length,
            location: moment.location,
            date: moment.date,
            maxCapacity: moment.maxCapacity
          })
        },
      });
    }
  }, [router]);

  if (isLoading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>{error}</Text>
      </View>
    );
  }

  if (data.length === 0 && !refreshing) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.emptyText, { color: colors.text }]}>No moments yet</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => (
        <FeedItem 
          item={item} 
          onPress={() => handleFeedItemPress(item)}
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});