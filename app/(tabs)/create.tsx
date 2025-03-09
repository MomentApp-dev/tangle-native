import React, { useState } from 'react';
import { StyleSheet, ScrollView, TextInput, Pressable, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { MomentData } from '@/types/feed';

export default function CreateScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = () => {
    // TODO: Replace with actual user data and API call
    const newMoment: MomentData = {
      id: Date.now().toString(),
      title,
      description,
      isHost: true,
      host: {
        id: '1',
        name: 'Current User',
        username: '@currentuser',
      },
      metadata: {
        createdAt: new Date().toISOString(),
        going: 0,
        interested: 0,
        notGoing: 0,
        views: 0,
      }
    };

    console.log('Creating new moment:', newMoment);
    // TODO: Add API call to create moment
    
    // Navigate back to home screen
    router.push('/(tabs)');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView}>
        <Text style={[styles.label, { color: colors.text }]}>Event Title</Text>
        <TextInput
          style={[styles.input, { 
            color: colors.text,
            backgroundColor: colors.background,
            borderColor: colors.border
          }]}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter event title"
          placeholderTextColor={colors.icon}
        />

        <Text style={[styles.label, { color: colors.text }]}>Description</Text>
        <TextInput
          style={[styles.textArea, { 
            color: colors.text,
            backgroundColor: colors.background,
            borderColor: colors.border
          }]}
          value={description}
          onChangeText={setDescription}
          placeholder="Describe your event"
          placeholderTextColor={colors.icon}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <Pressable
          style={({ pressed }) => [
            styles.createButton,
            { 
              backgroundColor: colors.tint,
              opacity: pressed ? 0.8 : 1 
            }
          ]}
          onPress={handleCreate}
          disabled={!title.trim()}
        >
          <Text style={styles.buttonText}>Create Event</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingTop: 12,
    fontSize: 16,
    minHeight: 120,
  },
  createButton: {
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});