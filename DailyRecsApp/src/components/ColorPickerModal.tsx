import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { theme } from '@/theme';
import { AccentColor, FREE_ACCENT_COLORS, PREMIUM_ACCENT_COLORS } from '@/constants/colors';
import { useLanguage } from '@/i18n/LanguageContext';
import { Language } from '@/i18n/translations';

interface Props {
  visible: boolean;
  selectedHex: string;
  isPremium: boolean;
  accentColor: string;
  onSelect: (hex: string) => void;
  onLockedPress: () => void;
  onClose: () => void;
}

function Swatch({
  color,
  language,
  selected,
  locked,
  onPress,
}: {
  color: AccentColor;
  language: Language;
  selected: boolean;
  locked: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.swatchWrap} onPress={onPress}>
      <View
        style={[
          styles.swatch,
          { backgroundColor: color.hex },
          selected && styles.swatchSelected,
          locked && styles.swatchLocked,
        ]}
      >
        {locked && (
          <View style={styles.lockBadge}>
            <Text style={styles.lockIcon}>🔒</Text>
          </View>
        )}
      </View>
      <Text style={styles.swatchLabel}>{color.label[language]}</Text>
    </Pressable>
  );
}

export default function ColorPickerModal({
  visible,
  selectedHex,
  isPremium,
  accentColor,
  onSelect,
  onLockedPress,
  onClose,
}: Props) {
  const { t, language } = useLanguage();
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <SafeAreaView style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>{t.colorModalTitle}</Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Text style={[styles.closeText, { color: accentColor }]}>{t.close}</Text>
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.sectionTitle}>{t.basicColors}</Text>
            <View style={styles.grid}>
              {FREE_ACCENT_COLORS.map((color) => (
                <Swatch
                  key={color.id}
                  color={color}
                  language={language}
                  selected={color.hex === selectedHex}
                  locked={false}
                  onPress={() => onSelect(color.hex)}
                />
              ))}
            </View>

            <Text style={styles.sectionTitle}>{t.premiumColors}</Text>
            <View style={styles.grid}>
              {PREMIUM_ACCENT_COLORS.map((color) => {
                const locked = !isPremium;
                return (
                  <Swatch
                    key={color.id}
                    color={color}
                    language={language}
                    selected={color.hex === selectedHex}
                    locked={locked}
                    onPress={() => (locked ? onLockedPress() : onSelect(color.hex))}
                  />
                );
              })}
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: theme.colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '75%',
    paddingTop: theme.spacing(2),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  title: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  closeText: {
    fontWeight: '600',
  },
  scrollContent: {
    padding: theme.spacing(2),
  },
  sectionTitle: {
    color: theme.colors.subtext,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing(1.5),
    marginBottom: theme.spacing(1),
  },
  swatchWrap: {
    alignItems: 'center',
    width: 64,
  },
  swatch: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatchSelected: {
    borderColor: theme.colors.text,
  },
  swatchLocked: {
    opacity: 0.75,
  },
  lockBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockIcon: {
    fontSize: 13,
  },
  swatchLabel: {
    color: theme.colors.subtext,
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
});
