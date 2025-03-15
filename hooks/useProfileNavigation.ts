import { router } from 'expo-router';
import { getCurrentUser } from '@/mockdb/mockApis';

export function useProfileNavigation() {
  const navigateToProfile = async (username: string) => {
    try {
      // Normalize the username by removing '@' and converting to lowercase
      const normalizedUsername = username.replace('@', '').toLowerCase();
      const currentUser = await getCurrentUser();
      
      // Log navigation attempt
      console.log('🧭 Profile Navigation:', {
        clickedUsername: normalizedUsername,
        currentUser: currentUser?.username,
        isSelf: currentUser?.username?.toLowerCase() === normalizedUsername
      });

      if (currentUser?.username?.toLowerCase() === normalizedUsername) {
        // If it's the current user, go to MyProfile tab
        router.navigate('/(tabs)/myProfile');
      } else {
        // If it's another user, go to their profile page
        router.push(`/(profile)/${normalizedUsername}`);
      }
    } catch (error) {
      console.error('Error navigating to profile:', error);
    }
  };

  return { navigateToProfile };
} 