import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { getCurrentUser } from '@/mockdb/mockApis';
import { User } from '@/types/user';
import ProfileScreen from '@/components/ProfileScreen';

export default function MyProfileScreen() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  if (isLoading || !currentUser) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return <ProfileScreen user={currentUser} isOwnProfile={true} />;
}