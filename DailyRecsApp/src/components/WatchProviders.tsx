import React from 'react';
import { View, Text, Image, Pressable, StyleSheet, Linking } from 'react-native';
import { theme } from '@/theme';
import { WatchProvider } from '@/types';
import { useLanguage } from '@/i18n/LanguageContext';

interface Props {
  providers: WatchProvider[];
  link: string | null;
}

export default function WatchProviders({ providers, link }: Props) {
  const { t } = useLanguage();

  if (providers.length === 0) {
    return <Text style={styles.emptyText}>{t.noProvidersFound}</Text>;
  }

  const content = (
    <View style={styles.row}>
      {providers.map((provider) => (
        <View key={`${provider.type}-${provider.id}`} style={styles.item}>
          {provider.logoUrl ? (
            <Image source={{ uri: provider.logoUrl }} style={styles.logo} />
          ) : (
            <View style={[styles.logo, styles.logoPlaceholder]} />
          )}
          <Text style={styles.name} numberOfLines={1}>
            {provider.name}
          </Text>
          <Text style={styles.type}>{t.watchProviderType[provider.type]}</Text>
        </View>
      ))}
    </View>
  );

  if (!link) return content;

  return <Pressable onPress={() => Linking.openURL(link)}>{content}</Pressable>;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing(1.5),
    marginTop: theme.spacing(1.5),
  },
  item: {
    alignItems: 'center',
    width: 56,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  logoPlaceholder: {
    backgroundColor: theme.colors.chip,
  },
  name: {
    color: theme.colors.text,
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
  },
  type: {
    color: theme.colors.subtext,
    fontSize: 9,
  },
  emptyText: {
    color: theme.colors.subtext,
    fontSize: 12,
    marginTop: theme.spacing(1.5),
  },
});
