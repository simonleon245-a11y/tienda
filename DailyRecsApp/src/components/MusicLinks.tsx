import React from 'react';
import { View, Text, Pressable, StyleSheet, Linking } from 'react-native';
import { theme } from '@/theme';

interface Props {
  spotifyUrl: string;
  youtubeMusicUrl: string;
  amazonMusicUrl: string;
}

const SERVICES: { key: keyof Props; label: string; color: string }[] = [
  { key: 'spotifyUrl', label: 'Spotify', color: '#1DB954' },
  { key: 'youtubeMusicUrl', label: 'YT Music', color: '#FF0000' },
  { key: 'amazonMusicUrl', label: 'Amazon Music', color: '#00A8E1' },
];

export default function MusicLinks({ spotifyUrl, youtubeMusicUrl, amazonMusicUrl }: Props) {
  const urls: Props = { spotifyUrl, youtubeMusicUrl, amazonMusicUrl };

  return (
    <View style={styles.row}>
      {SERVICES.map((service) => (
        <Pressable
          key={service.key}
          style={[styles.pill, { borderColor: service.color }]}
          onPress={() => Linking.openURL(urls[service.key])}
        >
          <View style={[styles.dot, { backgroundColor: service.color }]} />
          <Text style={styles.pillText}>{service.label}</Text>
        </Pressable>
      ))}
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
});
