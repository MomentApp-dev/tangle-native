import React, { useState } from 'react';
import { StyleSheet, ScrollView, TextInput, Pressable, Text, View, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { MomentData } from '@/types/feed';
import { Ionicons } from '@expo/vector-icons';

export default function CreateScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  const handleCreate = () => {
    // TODO: Replace with actual user data and API call
    console.log('Creating a new moment');
    const newMoment: MomentData = {
      title,
      description,
      isPublic,
      host: "1",
      startTime: 1,
      endTime: 1,
      location: "1",
    };
    
    fetch('http://localhost:8080/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newMoment),
    }).catch(error => {
      console.error(error);
    });
    
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

        {/* Privacy Toggle */}
        <View style={styles.privacyContainer}>
          <View style={styles.privacyLeft}>
            <Text style={[styles.privacyLabel, { color: colors.text }]}>
              {isPublic ? 'Public Event' : 'Private Event'}
            </Text>
            <Text style={[styles.privacyDescription, { color: colors.icon }]}>
              {isPublic 
                ? 'Anyone can see and join this event' 
                : 'Only people you invite can see and join'}
            </Text>
          </View>
          <View style={styles.privacyRight}>
            <View style={styles.iconContainer}>
              <Ionicons 
                name={isPublic ? "globe-outline" : "lock-closed-outline"} 
                size={20} 
                color={colors.icon}
                style={styles.privacyIcon}
              />
            </View>
            <Switch
              value={isPublic}
              onValueChange={setIsPublic}
              trackColor={{ false: colors.border, true: colors.tint }}
              thumbColor={colors.background}
              ios_backgroundColor={colors.border}
            />
          </View>
        </View>

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
  // New styles for privacy toggle
  privacyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
    paddingVertical: 8,
  },
  privacyLeft: {
    flex: 1,
    marginRight: 16,
  },
  privacyRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  privacyLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  privacyDescription: {
    fontSize: 14,
  },
  iconContainer: {
    marginRight: 12,
  },
  privacyIcon: {
    marginTop: 2,
  },
});