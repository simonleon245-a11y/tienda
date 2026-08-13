import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from '@/screens/HomeScreen';
import { initializeAds } from '@/services/ads';
import { scheduleRecommendationNotifications } from '@/services/notifications';
import { checkPremiumStatus } from '@/services/premium';
import { LanguageProvider, useLanguage } from '@/i18n/LanguageContext';

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
  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
