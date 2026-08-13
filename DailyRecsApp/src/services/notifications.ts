import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

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
export async function scheduleRecommendationNotifications(): Promise<void> {
  const granted = await requestNotificationPermissions();
  if (!granted) return;

  await Notifications.cancelAllScheduledNotificationsAsync();

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('daily-recos', {
      name: 'Recomendaciones diarias',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Tu álbum y película del día ya están listos 🎵🎬',
      body: 'Abre la app para descubrir las recomendaciones de hoy.',
    },
    trigger: {
      hour: DAILY_HOUR,
      minute: 0,
      repeats: true,
    },
  });

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Nuevo libro del mes disponible 📚',
      body: 'Ya tienes una nueva recomendación de lectura para este mes.',
    },
    trigger: {
      day: MONTHLY_DAY,
      hour: MONTHLY_HOUR,
      minute: 0,
      repeats: true,
    },
  });
}
