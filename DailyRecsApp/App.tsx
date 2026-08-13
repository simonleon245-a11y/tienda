import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from '@/screens/HomeScreen';
import { initializeAds } from '@/services/ads';
import { scheduleRecommendationNotifications } from '@/services/notifications';
import { checkPremiumStatus } from '@/services/premium';

export default function App() {
  useEffect(() => {
    checkPremiumStatus().then((isPremium) => {
      if (!isPremium) initializeAds().catch(() => {});
    });
    scheduleRecommendationNotifications().catch(() => {});
  }, []);

  return (
    <SafeAreaProvider>
      <HomeScreen />
    </SafeAreaProvider>
  );
}
