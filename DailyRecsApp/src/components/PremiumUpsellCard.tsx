import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { theme } from '@/theme';
import { useLanguage } from '@/i18n/LanguageContext';

interface Props {
  onSubscribe: () => void;
  onLifetime: () => void;
}

export default function PremiumUpsellCard({ onSubscribe, onLifetime }: Props) {
  const { t } = useLanguage();
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{t.premiumCardTitle}</Text>
      <Text style={styles.price}>{t.premiumPrice}</Text>
      {t.premiumBenefits.map((benefit) => (
        <Text key={benefit} style={styles.benefit}>
          ✓ {benefit}
        </Text>
      ))}
      <Pressable style={styles.button} onPress={onSubscribe}>
        <Text style={styles.buttonText}>{t.subscribeButton}</Text>
      </Pressable>
      <Pressable onPress={onLifetime}>
        <Text style={styles.lifetimeLink}>{t.lifetimeButton}</Text>
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
  lifetimeLink: {
    color: theme.colors.subtext,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: theme.spacing(1),
  },
});
