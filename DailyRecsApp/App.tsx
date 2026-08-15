import React, { useCallback, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
} from '@expo-google-fonts/poppins';
import HomeScreen from '@/screens/HomeScreen';
import { initializeAds } from '@/services/ads';
import { scheduleRecommendationNotifications } from '@/services/notifications';
import { checkPremiumStatus } from '@/services/premium';
import { LanguageProvider, useLanguage } from '@/i18n/LanguageContext';

SplashScreen.preventAutoHideAsync().catch(() => {});

function AppContent() {
  const { language } = useLanguage();

  useEffect(() => {
    checkPremiumStatus().then((isPremium) => {
      if (!isPremium) initializeAds().catch(() => {});
    });
    scheduleRecommendationNotifications(language).catch(() => {});
  }, [language]);

  return <HomeScreen />;
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });

  const onLayout = useCallback(() => {
    if (fontsLoaded) SplashScreen.hideAsync().catch(() => {});
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider onLayout={onLayout}>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
