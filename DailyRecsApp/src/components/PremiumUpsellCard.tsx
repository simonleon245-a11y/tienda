import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { theme } from '@/theme';

const BENEFITS = [
  'Cero anuncios (ni banner ni intersticial)',
  '"Ver otra opción" ilimitado en álbum, película y libro',
  'Historial de recomendaciones pasadas (próximamente)',
  'Acceso anticipado a nuevos géneros y funciones',
];

interface Props {
  onSubscribe: () => void;
}

export default function PremiumUpsellCard({ onSubscribe }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Recos Premium</Text>
      <Text style={styles.price}>$3 USD / mes</Text>
      {BENEFITS.map((benefit) => (
        <Text key={benefit} style={styles.benefit}>
          ✓ {benefit}
        </Text>
      ))}
      <Pressable style={styles.button} onPress={onSubscribe}>
        <Text style={styles.buttonText}>Suscribirme</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  title: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  price: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: theme.spacing(1),
  },
  benefit: {
    color: theme.colors.subtext,
    fontSize: 13,
    marginBottom: 4,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.chip,
    paddingVertical: theme.spacing(1.25),
    alignItems: 'center',
    marginTop: theme.spacing(1.5),
  },
  buttonText: {
    color: theme.colors.primaryText,
    fontWeight: '700',
  },
});
