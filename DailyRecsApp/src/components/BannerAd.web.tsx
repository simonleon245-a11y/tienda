import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { ENV } from '@/utils/env';

const ADSENSE_LOADER_ID = 'adsbygoogle-loader';

/** Inserta el script de carga de AdSense una sola vez por página, sin
 * importar cuántos banners haya montados. */
function ensureAdSenseScript(clientId: string): void {
  if (document.getElementById(ADSENSE_LOADER_ID)) return;
  const script = document.createElement('script');
  script.id = ADSENSE_LOADER_ID;
  script.async = true;
  script.crossOrigin = 'anonymous';
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
  document.head.appendChild(script);
}

/** En la app (PWA) no hay SDK nativo de AdMob, así que en web mostramos
 * un anuncio de Google AdSense en su lugar. Sin ADSENSE_CLIENT_ID/
 * ADSENSE_SLOT_ID configurados (hasta que apruebe la cuenta de AdSense)
 * no renderiza nada. */
export default function BannerAd() {
  const containerRef = useRef<View>(null);

  useEffect(() => {
    const { ADSENSE_CLIENT_ID: clientId, ADSENSE_SLOT_ID: slotId } = ENV;
    if (!clientId || !slotId) return;

    ensureAdSenseScript(clientId);

    const node = containerRef.current as unknown as HTMLElement | null;
    if (!node || node.querySelector('ins.adsbygoogle')) return;

    const ins = document.createElement('ins');
    ins.className = 'adsbygoogle';
    ins.style.display = 'block';
    ins.setAttribute('data-ad-client', clientId);
    ins.setAttribute('data-ad-slot', slotId);
    ins.setAttribute('data-ad-format', 'auto');
    ins.setAttribute('data-full-width-responsive', 'true');
    node.appendChild(ins);

    try {
      const w = window as unknown as { adsbygoogle?: unknown[] };
      (w.adsbygoogle = w.adsbygoogle || []).push({});
    } catch {
      // El script puede tardar en cargar; Google reintenta solo.
    }
  }, []);

  if (!ENV.ADSENSE_CLIENT_ID || !ENV.ADSENSE_SLOT_ID) return null;

  return <View ref={containerRef} style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    minHeight: 90,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
});
