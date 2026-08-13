import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { theme } from '@/theme';
import { useLanguage } from '@/i18n/LanguageContext';

interface Props {
  categoryLabel: string;
  frequencyLabel: string;
  genreLabel: string;
  loading: boolean;
  error: string | null;
  accentColor: string;
  onChangeGenre: () => void;
  onRetry: () => void;
  onReroll: () => void;
  children: React.ReactNode;
}

export default function RecommendationCard({
  categoryLabel,
  frequencyLabel,
  genreLabel,
  loading,
  error,
  accentColor,
  onChangeGenre,
  onRetry,
  onReroll,
  children,
}: Props) {
  const { t } = useLanguage();
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.categoryLabel}>{categoryLabel}</Text>
        <Text style={styles.frequencyLabel}>{frequencyLabel}</Text>
      </View>

      <View style={styles.body}>
        {loading && (
          <View style={styles.centered}>
            <ActivityIndicator color={accentColor} />
          </View>
        )}
        {!loading && error && (
          <View style={styles.centered}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable
              style={[styles.retryButton, { backgroundColor: accentColor }]}
              onPress={onRetry}
            >
              <Text style={styles.retryButtonText}>{t.retry}</Text>
            </Pressable>
          </View>
        )}
        {!loading && !error && children}
      </View>

      <View style={styles.footer}>
        <View style={styles.chip}>
          <Text style={styles.chipText}>{genreLabel}</Text>
        </View>
        <View style={styles.footerButtons}>
          <Pressable style={styles.changeButton} onPress={onReroll} disabled={loading}>
            <Text style={[styles.changeButtonText, { color: accentColor }]}>{t.reroll}</Text>
          </Pressable>
          <Pressable style={styles.changeButton} onPress={onChangeGenre}>
            <Text style={[styles.changeButtonText, { color: accentColor }]}>
              {t.changeGenre}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(1.5),
  },
  categoryLabel: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  frequencyLabel: {
    color: theme.colors.subtext,
    fontSize: 12,
  },
  body: {
    minHeight: 100,
    justifyContent: 'center',
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing(2),
  },
  errorText: {
    color: theme.colors.error,
    textAlign: 'center',
    marginBottom: theme.spacing(1),
  },
  retryButton: {
    paddingHorizontal: theme.spacing(2),
    paddingVertical: theme.spacing(1),
    borderRadius: theme.radius.chip,
  },
  retryButtonText: {
    color: theme.colors.primaryText,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing(1.5),
  },
  footerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  chip: {
    backgroundColor: theme.colors.chip,
    borderRadius: theme.radius.chip,
    paddingHorizontal: theme.spacing(1.5),
    paddingVertical: theme.spacing(0.5),
  },
  chipText: {
    color: theme.colors.subtext,
    fontSize: 12,
    fontWeight: '600',
  },
  changeButton: {
    paddingHorizontal: theme.spacing(1),
    paddingVertical: theme.spacing(0.5),
  },
  changeButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
