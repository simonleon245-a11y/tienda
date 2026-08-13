import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { getBannerAdUnitId } from '@/services/ads';
import { isExpoGo } from '@/utils/environment';

type GoogleAdsModule = typeof import('react-native-google-mobile-ads');

export default function BannerAd() {
  const [mod, setMod] = useState<GoogleAdsModule | null>(null);

  useEffect(() => {
    // Import diferido: cargar el paquete (aunque sea sin usarlo) dispara
    // su código nativo, que no existe dentro de Expo Go.
    if (isExpoGo) return;
    import('react-native-google-mobile-ads').then(setMod);
  }, []);

  if (isExpoGo || !mod) return null;

  const { BannerAd: GoogleBannerAd, BannerAdSize } = mod;

  return (
    <View style={styles.container}>
      <GoogleBannerAd
        unitId={getBannerAdUnitId()}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: false }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
});
