import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ENV } from '@/utils/env';
import { theme } from '@/theme';
import { useLanguage } from '@/i18n/LanguageContext';
import { CookieConsent, getCookieConsent, setCookieConsent } from '@/services/storage';

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

function pushAdSlot(container: HTMLElement, clientId: string, slotId: string): void {
  if (container.querySelector('ins.adsbygoogle')) return;
  const ins = document.createElement('ins');
  ins.className = 'adsbygoogle';
  ins.style.display = 'block';
  ins.setAttribute('data-ad-client', clientId);
  ins.setAttribute('data-ad-slot', slotId);
  ins.setAttribute('data-ad-format', 'auto');
  ins.setAttribute('data-full-width-responsive', 'true');
  container.appendChild(ins);

  try {
    const w = window as unknown as { adsbygoogle?: unknown[] };
    (w.adsbygoogle = w.adsbygoogle || []).push({});
  } catch {
    // El script puede tardar en cargar; Google reintenta solo.
  }
}

/** En la app (PWA) no hay SDK nativo de AdMob, así que en web mostramos
 * un anuncio de Google AdSense en su lugar. Sin ADSENSE_CLIENT_ID/
 * ADSENSE_SLOT_ID configurados (hasta que apruebe la cuenta de AdSense)
 * no renderiza nada.
 *
 * AdSense es el único script de terceros que corre dentro de la app, así
 * que el consentimiento se pide justo aquí, en vez de un banner global:
 * mientras no haya una respuesta guardada, se muestra el aviso en el
 * mismo espacio donde iría el anuncio, y el script de AdSense no se
 * carga hasta que la persona toque "Aceptar". */
export default function BannerAd() {
  const { t } = useLanguage();
  const containerRef = useRef<View>(null);
  const [consent, setConsent] = useState<CookieConsent>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getCookieConsent().then((value) => {
      setConsent(value);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (consent !== 'accepted') return;
    const { ADSENSE_CLIENT_ID: clientId, ADSENSE_SLOT_ID: slotId } = ENV;
    if (!clientId || !slotId) return;

    ensureAdSenseScript(clientId);
    const node = containerRef.current as unknown as HTMLElement | null;
    if (node) pushAdSlot(node, clientId, slotId);
  }, [consent]);

  if (!ENV.ADSENSE_CLIENT_ID || !ENV.ADSENSE_SLOT_ID) return null;
  if (!loaded) return null;

  if (consent !== 'accepted') {
    return (
      <View style={styles.consentBox}>
        <Text style={styles.consentText}>{t.cookieConsentMessage}</Text>
        <View style={styles.consentButtons}>
          <Pressable
            style={styles.consentButtonGhost}
            onPress={() => setCookieConsent('rejected').then(() => setConsent('rejected'))}
          >
            <Text style={styles.consentButtonGhostText}>{t.cookieConsentReject}</Text>
          </Pressable>
          <Pressable
            style={styles.consentButton}
            onPress={() => setCookieConsent('accepted').then(() => setConsent('accepted'))}
          >
            <Text style={styles.consentButtonText}>{t.cookieConsentAccept}</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return <View ref={containerRef} style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    minHeight: 90,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  consentBox: {
    backgroundColor: theme.colors.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.cardBorder,
    paddingHorizontal: theme.spacing(2),
    paddingVertical: theme.spacing(1.5),
    gap: theme.spacing(1),
  },
  consentText: {
    color: theme.colors.subtext,
    fontSize: 12,
    textAlign: 'center',
  },
  consentButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing(1.5),
  },
  consentButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.chip,
    paddingHorizontal: theme.spacing(2),
    paddingVertical: theme.spacing(0.75),
  },
  consentButtonText: {
    color: theme.colors.primaryText,
    fontSize: 12,
    fontWeight: '700',
  },
  consentButtonGhost: {
    borderRadius: theme.radius.chip,
    paddingHorizontal: theme.spacing(2),
    paddingVertical: theme.spacing(0.75),
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  consentButtonGhostText: {
    color: theme.colors.subtext,
    fontSize: 12,
    fontWeight: '700',
  },
});
