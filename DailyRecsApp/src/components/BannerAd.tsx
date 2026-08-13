import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BannerAd as GoogleBannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { getBannerAdUnitId } from '@/services/ads';
import { isExpoGo } from '@/utils/environment';

export default function BannerAd() {
  if (isExpoGo) return null; // el SDK nativo de AdMob no existe dentro de Expo Go

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
