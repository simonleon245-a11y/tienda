import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from '@/screens/HomeScreen';
import { initializeAds } from '@/services/ads';
import { scheduleRecommendationNotifications } from '@/services/notifications';

export default function App() {
  useEffect(() => {
    initializeAds().catch(() => {});
    scheduleRecommendationNotifications().catch(() => {});
  }, []);

  return (
    <SafeAreaProvider>
      <HomeScreen />
    </SafeAreaProvider>
  );
}
