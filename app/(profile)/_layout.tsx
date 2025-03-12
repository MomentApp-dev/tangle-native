import { Stack } from 'expo-router';

export default function ProfileLayout() {
  console.log('🏗️ Profile Layout Mounted');
  
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="[username]/index" />
    </Stack>
  );
} 