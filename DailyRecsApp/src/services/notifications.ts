import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Language, translations } from '@/i18n/translations';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const DAILY_HOUR = 9;
const MONTHLY_DAY = 1;
const MONTHLY_HOUR = 10;

export async function requestNotificationPermissions(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const request = await Notifications.requestPermissionsAsync();
  return request.granted;
}

/**
 * Cancela y vuelve a programar las notificaciones locales (diaria de
 * álbum/película, mensual de libro). Es idempotente: se puede llamar en
 * cada arranque de la app sin duplicar notificaciones.
 */
export async function scheduleRecommendationNotifications(language: Language = 'es'): Promise<void> {
  const granted = await requestNotificationPermissions();
  if (!granted) return;

  const t = translations[language];
  await Notifications.cancelAllScheduledNotificationsAsync();

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('daily-recos', {
      name: t.notificationChannelName,
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: t.dailyNotificationTitle,
      body: t.dailyNotificationBody,
    },
    trigger: {
      hour: DAILY_HOUR,
      minute: 0,
      repeats: true,
    },
  });

  await Notifications.scheduleNotificationAsync({
    content: {
      title: t.monthlyNotificationTitle,
      body: t.monthlyNotificationBody,
    },
    trigger: {
      day: MONTHLY_DAY,
      hour: MONTHLY_HOUR,
      minute: 0,
      repeats: true,
    },
  });
}
