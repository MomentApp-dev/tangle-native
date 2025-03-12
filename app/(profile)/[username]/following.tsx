import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { getFollowing, getUserByUsername } from '@/mockdb/mockApis';
import { User } from '@/types/user';

export default function FollowingScreen() {
  const { username } = useLocalSearchParams<{ username: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [following, setFollowing] = useState<User[]>([]);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    const loadData = async () => {
      if (username) {
        const userData = await getUserByUsername(username);
        setUser(userData);
        if (userData) {
          const followingList = getFollowing(userData.id).filter((f): f is User => f !== undefined);
          setFollowing(followingList);
        }
      }
    };
    loadData();
  }, [username]);

  const renderFollowing = ({ item }: { item: User }) => (
    <Pressable 
      style={styles.followerItem}
      onPress={() => router.push(`/(profile)/${item.username}`)}
    >
      {item.profilePictureUrl ? (
        <Image 
          source={{ uri: item.profilePictureUrl }} 
          style={styles.profileImage}
        />
      ) : (
        <View style={[styles.profileImage, { backgroundColor: colors.icon }]}>
          <Ionicons name="person" size={20} color={colors.background} />
        </View>
      )}
      <View style={styles.userInfo}>
        <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.username, { color: colors.icon }]}>@{item.username}</Text>
        <Text style={[styles.bio, { color: colors.text }]} numberOfLines={2}>
          {item.bio}
        </Text>
      </View>
      <Pressable 
        style={[styles.followButton, { backgroundColor: colors.text }]}
        onPress={() => {/* TODO: Implement follow/unfollow */}}
      >
        <Text style={[styles.followButtonText, { color: colors.background }]}>
          Following
        </Text>
      </Pressable>
    </Pressable>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={colors.text} />
        </Pressable>
        <View style={styles.headerTitles}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {user?.name}
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.icon }]}>
            Following
          </Text>
        </View>
      </View>
      <FlatList
        data={following}
        renderItem={renderFollowing}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => (
          <View style={[styles.separator, { backgroundColor: colors.icon }]} />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#38444d',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitles: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  headerSubtitle: {
    fontSize: 14,
  },
  listContent: {
    paddingVertical: 8,
  },
  followerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  username: {
    fontSize: 14,
    marginBottom: 4,
  },
  bio: {
    fontSize: 14,
    lineHeight: 18,
  },
  followButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  followButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 76,
  },
}); 