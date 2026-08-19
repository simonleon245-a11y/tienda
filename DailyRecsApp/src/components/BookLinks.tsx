import React from 'react';
import { View, Text, Pressable, StyleSheet, Linking } from 'react-native';
import { theme } from '@/theme';
import { useLanguage } from '@/i18n/LanguageContext';

interface Props {
  infoUrl: string;
  amazonUrl: string;
}

export default function BookLinks({ infoUrl, amazonUrl }: Props) {
  const { t } = useLanguage();

  return (
    <View style={styles.row}>
      <Pressable
        style={[styles.pill, { borderColor: '#4285F4' }]}
        onPress={() => Linking.openURL(infoUrl)}
      >
        <View style={[styles.dot, { backgroundColor: '#4285F4' }]} />
        <Text style={styles.pillText}>Google Books</Text>
      </Pressable>
      <View style={styles.amazonGroup}>
        <Pressable
          style={[styles.pill, { borderColor: '#FF9900' }]}
          onPress={() => Linking.openURL(amazonUrl)}
        >
          <View style={[styles.dot, { backgroundColor: '#FF9900' }]} />
          <Text style={styles.pillText}>{t.buyOnAmazon}</Text>
        </Pressable>
        <Text style={styles.affiliateNote}>{t.affiliateLinkNote}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    marginTop: theme.spacing(1.5),
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: theme.radius.chip,
    paddingHorizontal: theme.spacing(1.25),
    paddingVertical: theme.spacing(0.5),
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  pillText: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  amazonGroup: {
    gap: 2,
  },
  affiliateNote: {
    color: theme.colors.subtext,
    fontSize: 10,
    marginLeft: 2,
  },
});
