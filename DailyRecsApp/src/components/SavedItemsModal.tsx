import React from 'react';
import { Modal, View, Text, Image, FlatList, Pressable, StyleSheet, SafeAreaView, Linking } from 'react-native';
import { theme } from '@/theme';
import { useLanguage } from '@/i18n/LanguageContext';
import { SavedItem } from '@/types';

interface Props {
  visible: boolean;
  items: SavedItem[];
  accentColor: string;
  onRemove: (category: string, id: string) => void;
  onClose: () => void;
}

export default function SavedItemsModal({ visible, items, accentColor, onRemove, onClose }: Props) {
  const { t } = useLanguage();

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <SafeAreaView style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>{t.savedItemsModalTitle}</Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Text style={[styles.closeText, { color: accentColor }]}>{t.close}</Text>
            </Pressable>
          </View>

          {items.length === 0 ? (
            <Text style={styles.emptyText}>{t.savedItemsEmpty}</Text>
          ) : (
            <FlatList
              data={items}
              keyExtractor={(item) => `${item.category}:${item.id}`}
              contentContainerStyle={styles.list}
              renderItem={({ item }) => (
                <View style={styles.row}>
                  {item.coverUrl ? (
                    <Image source={{ uri: item.coverUrl }} style={styles.cover} />
                  ) : (
                    <View style={[styles.cover, styles.coverPlaceholder]} />
                  )}
                  <View style={styles.info}>
                    <Text style={styles.itemTitle} numberOfLines={2}>
                      {item.title}
                    </Text>
                    <Text style={styles.itemSubtitle} numberOfLines={1}>
                      {item.subtitle}
                    </Text>
                    <View style={styles.rowButtons}>
                      <Pressable onPress={() => Linking.openURL(item.openUrl)}>
                        <Text style={[styles.actionText, { color: accentColor }]}>{t.openAction}</Text>
                      </Pressable>
                      <Pressable onPress={() => onRemove(item.category, item.id)}>
                        <Text style={styles.removeText}>{t.removeSavedAction}</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              )}
            />
          )}
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
    maxHeight: '80%',
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
    fontFamily: theme.fonts.heading,
  },
  closeText: {
    fontWeight: '600',
  },
  emptyText: {
    color: theme.colors.subtext,
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: theme.spacing(2),
    paddingVertical: theme.spacing(4),
  },
  list: {
    padding: theme.spacing(2),
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing(1.5),
    marginBottom: theme.spacing(2),
  },
  cover: {
    width: 56,
    height: 56,
    borderRadius: 10,
  },
  coverPlaceholder: {
    backgroundColor: theme.colors.chip,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  itemTitle: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  itemSubtitle: {
    color: theme.colors.subtext,
    fontSize: 12,
    marginTop: 2,
  },
  rowButtons: {
    flexDirection: 'row',
    gap: theme.spacing(2),
    marginTop: theme.spacing(0.75),
  },
  actionText: {
    fontSize: 12,
    fontWeight: '700',
  },
  removeText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.error,
  },
});
