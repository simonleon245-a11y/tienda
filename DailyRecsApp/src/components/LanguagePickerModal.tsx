import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import { theme } from '@/theme';
import { useLanguage } from '@/i18n/LanguageContext';
import { Language } from '@/i18n/translations';

interface Props {
  visible: boolean;
  accentColor: string;
  onClose: () => void;
}

const OPTIONS: { code: Language; flag: string; label: string }[] = [
  { code: 'es', flag: '🇪🇸', label: 'Español' },
  { code: 'en', flag: '🇬🇧', label: 'English' },
];

export default function LanguagePickerModal({ visible, accentColor, onClose }: Props) {
  const { t, language, setLanguage } = useLanguage();

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <SafeAreaView style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>{t.languageModalTitle}</Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Text style={[styles.closeText, { color: accentColor }]}>{t.close}</Text>
            </Pressable>
          </View>
          {OPTIONS.map((option) => {
            const selected = option.code === language;
            return (
              <Pressable
                key={option.code}
                style={[styles.option, selected && { backgroundColor: accentColor }]}
                onPress={() => {
                  setLanguage(option.code);
                  onClose();
                }}
              >
                <Text style={styles.flag}>{option.flag}</Text>
                <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
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
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(3),
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
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    marginHorizontal: theme.spacing(2),
    marginTop: theme.spacing(1),
    backgroundColor: theme.colors.chip,
    borderRadius: 12,
    paddingVertical: theme.spacing(1.5),
    paddingHorizontal: theme.spacing(2),
  },
  flag: {
    fontSize: 22,
  },
  optionText: {
    color: theme.colors.subtext,
    fontWeight: '600',
    fontSize: 15,
  },
  optionTextSelected: {
    color: theme.colors.primaryText,
  },
});
