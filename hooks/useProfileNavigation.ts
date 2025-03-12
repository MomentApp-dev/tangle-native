import { router } from 'expo-router';
import { getCurrentUser } from '@/mockdb/mockApis';

export function useProfileNavigation() {
  const navigateToProfile = async (username: string) => {
    try {
      const currentUser = await getCurrentUser();
      
      // Log navigation attempt
      console.log('🧭 Profile Navigation:', {
        clickedUsername: username,
        currentUser: currentUser?.username,
        isSelf: currentUser?.username === username
      });

      if (currentUser?.username === username) {
        // If it's the current user, go to MyProfile tab
        router.navigate('/(tabs)/myProfile');
      } else {
        // If it's another user, go to their profile page
        router.push(`/(profile)/${username}`);
      }
    } catch (error) {
      console.error('Error navigating to profile:', error);
    }
  };

  return { navigateToProfile };
} 