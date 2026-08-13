import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { theme } from '@/theme';
import { AccentColor, FREE_ACCENT_COLORS, PREMIUM_ACCENT_COLORS } from '@/constants/colors';

interface Props {
  visible: boolean;
  selectedHex: string;
  isPremium: boolean;
  onSelect: (hex: string) => void;
  onLockedPress: () => void;
  onClose: () => void;
}

function Swatch({
  color,
  selected,
  locked,
  onPress,
}: {
  color: AccentColor;
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
        {locked && <Text style={styles.lockIcon}>🔒</Text>}
      </View>
      <Text style={styles.swatchLabel}>{color.label}</Text>
    </Pressable>
  );
}

export default function ColorPickerModal({
  visible,
  selectedHex,
  isPremium,
  onSelect,
  onLockedPress,
  onClose,
}: Props) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <SafeAreaView style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Color de la app</Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Text style={styles.closeText}>Cerrar</Text>
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.sectionTitle}>Básicos</Text>
            <View style={styles.grid}>
              {FREE_ACCENT_COLORS.map((color) => (
                <Swatch
                  key={color.id}
                  color={color}
                  selected={color.hex === selectedHex}
                  locked={false}
                  onPress={() => onSelect(color.hex)}
                />
              ))}
            </View>

            <Text style={styles.sectionTitle}>Premium ✨</Text>
            <View style={styles.grid}>
              {PREMIUM_ACCENT_COLORS.map((color) => {
                const locked = !isPremium;
                return (
                  <Swatch
                    key={color.id}
                    color={color}
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
    color: theme.colors.primary,
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
    opacity: 0.45,
  },
  lockIcon: {
    fontSize: 16,
  },
  swatchLabel: {
    color: theme.colors.subtext,
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
});
