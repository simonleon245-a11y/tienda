import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/theme';
import { useLanguage } from '@/i18n/LanguageContext';

interface Props {
  categoryLabel: string;
  frequencyLabel: string;
  genreLabel: string;
  loading: boolean;
  error: string | null;
  accentColor: string;
  itemTintColor?: string;
  isSaved?: boolean;
  onSave?: () => void;
  onShare?: () => void;
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
  itemTintColor,
  isSaved,
  onSave,
  onShare,
  onChangeGenre,
  onRetry,
  onReroll,
  children,
}: Props) {
  const { t } = useLanguage();
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const wasLoading = useRef(loading);

  useEffect(() => {
    if (wasLoading.current && !loading) {
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 320,
        useNativeDriver: true,
      }).start();
    }
    wasLoading.current = loading;
  }, [loading, fadeAnim]);

  return (
    <View style={[styles.card, itemTintColor ? { borderTopColor: itemTintColor, borderTopWidth: 3 } : null]}>
      <View style={styles.headerRow}>
        <Text style={styles.categoryLabel}>{categoryLabel}</Text>
        <Text style={styles.frequencyLabel}>{frequencyLabel}</Text>
      </View>

      {!loading && !error && (onSave || onShare) && (
        <View style={styles.actionRow}>
          {onSave && (
            <Pressable style={styles.actionPressable} onPress={onSave} hitSlop={8}>
              <Ionicons
                name={isSaved ? 'bookmark' : 'bookmark-outline'}
                size={15}
                color={accentColor}
              />
              <Text style={[styles.actionText, { color: accentColor }]}>
                {isSaved ? t.savedAction : t.saveAction}
              </Text>
            </Pressable>
          )}
          {onShare && (
            <Pressable style={styles.actionPressable} onPress={onShare} hitSlop={8}>
              <Ionicons name="share-outline" size={15} color={accentColor} />
              <Text style={[styles.actionText, { color: accentColor }]}>{t.shareAction}</Text>
            </Pressable>
          )}
        </View>
      )}

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
        {!loading && !error && (
          <Animated.View style={{ opacity: fadeAnim }}>{children}</Animated.View>
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.chip}>
          <Text style={styles.chipText}>{genreLabel}</Text>
        </View>
        <View style={styles.footerButtons}>
          <Pressable style={[styles.changeButton, styles.actionPressable]} onPress={onReroll} disabled={loading}>
            <Ionicons name="shuffle" size={14} color={accentColor} />
            <Text style={[styles.changeButtonText, { color: accentColor }]}>{t.reroll}</Text>
          </Pressable>
          <Pressable style={[styles.changeButton, styles.actionPressable]} onPress={onChangeGenre}>
            <Ionicons name="swap-horizontal" size={14} color={accentColor} />
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
    fontFamily: theme.fonts.heading,
  },
  frequencyLabel: {
    color: theme.colors.subtext,
    fontSize: 12,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  actionPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '700',
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
