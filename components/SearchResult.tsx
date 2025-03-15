import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { getMoment, getRSVPCount, getUser } from '@/mockdb/mockApis';
import { rsvps } from '@/mockdb/mockRsvps';

type SearchResultProps = {
  item: {
    id: string;
    type: 'created' | 'user';
    momentId?: string;
    momentTitle?: string;
    momentTime?: string;
    userId?: string;
    name?: string;
    username?: string;
    profilePictureUrl?: string;
  };
};

export function SearchResult({ item }: SearchResultProps) {
  const router = useRouter();

  const handlePress = () => {
    if (item.type === 'user') {
      router.push(`/(profile)/${item.username}`);
    } else {
      const moment = getMoment(item.momentId || '');
      if (moment) {
        const host = getUser(moment.hostId);
        if (host) {
          router.push({
            pathname: '/moment',
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
      }
    }
  };

  if (item.type === 'user') {
    return (
      <TouchableOpacity style={styles.container} onPress={handlePress}>
        <Image
          source={{ uri: item.profilePictureUrl }}
          style={styles.profilePicture}
        />
        <View style={styles.userInfo}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.username}>@{item.username}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.momentIconContainer}>
        <IconSymbol name="calendar" size={24} color="#666" />
      </View>
      <View style={styles.momentInfo}>
        <Text style={styles.momentTitle}>{item.momentTitle}</Text>
        <Text style={styles.momentTime}>{new Date(item.momentTime || '').toLocaleDateString()}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#DBDBDB',
    alignItems: 'center',
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userInfo: {
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  username: {
    fontSize: 14,
    color: '#666',
  },
  momentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  momentInfo: {
    marginLeft: 12,
    flex: 1,
  },
  momentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  momentTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
}); 