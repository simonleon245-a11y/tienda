import { Alert, Platform } from 'react-native';

interface AlertAction {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

/**
 * `Alert.alert` de React Native no muestra nada en web (react-native-web
 * no lo implementa con una UI real). Este helper usa `Alert.alert` en
 * Android/iOS y cae a `window.confirm`/`window.alert` en web, para que
 * los mismos flujos (aviso de límite de reroll, error de suscripción)
 * funcionen en la futura PWA.
 */
export function showAlert(title: string, message: string, actions?: AlertAction[]): void {
  if (Platform.OS !== 'web') {
    Alert.alert(title, message, actions);
    return;
  }

  const text = `${title}\n\n${message}`;
  if (actions && actions.length > 1) {
    const confirmed = window.confirm(text);
    const chosen = confirmed
      ? actions.find((a) => a.style !== 'cancel')
      : actions.find((a) => a.style === 'cancel');
    chosen?.onPress?.();
    return;
  }

  window.alert(text);
  actions?.[0]?.onPress?.();
}
