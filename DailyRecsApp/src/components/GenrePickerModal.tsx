import React from 'react';
import { Modal, View, Text, FlatList, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import { theme } from '@/theme';
import { Genre } from '@/types';

interface Props {
  visible: boolean;
  title: string;
  genres: Genre[];
  selectedId: string;
  accentColor: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}

export default function GenrePickerModal({
  visible,
  title,
  genres,
  selectedId,
  accentColor,
  onSelect,
  onClose,
}: Props) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <SafeAreaView style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Text style={[styles.closeText, { color: accentColor }]}>Cerrar</Text>
            </Pressable>
          </View>
          <FlatList
            data={genres}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => {
              const selected = item.id === selectedId;
              return (
                <Pressable
                  style={[styles.option, selected && { backgroundColor: accentColor }]}
                  onPress={() => onSelect(item.id)}
                >
                  <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                    {item.label}
                  </Text>
                </Pressable>
              );
            }}
          />
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
  list: {
    padding: theme.spacing(2),
  },
  row: {
    gap: theme.spacing(1),
  },
  option: {
    flex: 1,
    backgroundColor: theme.colors.chip,
    borderRadius: 12,
    paddingVertical: theme.spacing(1.5),
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  optionText: {
    color: theme.colors.subtext,
    fontWeight: '600',
  },
  optionTextSelected: {
    color: theme.colors.primaryText,
  },
});
