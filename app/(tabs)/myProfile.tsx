import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/mockdb/mockApis';
import { User } from '@/types/user';

export default function MyProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  
  console.log('👤 My Profile Tab Screen Mounted');

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Error loading user:', error);
      }
    };

    loadUser();
  }, []);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>My Profile</Text>
      <Text style={styles.username}>@{user.username}</Text>
      {/* My profile specific actions */}
      <View style={styles.actions}>
        <Pressable style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    fontSize: 24,
    marginBottom: 12,
  },
  username: {
    fontSize: 18,
    opacity: 0.7,
    marginBottom: 20,
  },
  actions: {
    marginTop: 20,
  },
  editButton: {
    padding: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 16,
  },
});