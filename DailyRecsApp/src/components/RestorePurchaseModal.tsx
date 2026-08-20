import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import { theme } from '@/theme';
import { useLanguage } from '@/i18n/LanguageContext';
import { PremiumVerificationResult } from '@/services/premium';

interface Props {
  visible: boolean;
  accentColor: string;
  onSubmit: (email: string) => Promise<PremiumVerificationResult>;
  onClose: () => void;
}

type Status = 'idle' | 'checking' | 'found' | 'not-found' | 'error';

export default function RestorePurchaseModal({ visible, accentColor, onSubmit, onClose }: Props) {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  const handleClose = () => {
    setEmail('');
    setStatus('idle');
    onClose();
  };

  const handleSubmit = async () => {
    if (!email.trim()) {
      setStatus('error');
      return;
    }
    setStatus('checking');
    try {
      const result = await onSubmit(email.trim());
      setStatus(result.premium ? 'found' : 'not-found');
    } catch {
      setStatus('error');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <SafeAreaView style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>{t.restoreModalTitle}</Text>
            <Pressable onPress={handleClose} hitSlop={12}>
              <Text style={[styles.closeText, { color: accentColor }]}>{t.close}</Text>
            </Pressable>
          </View>

          {status === 'found' ? (
            <Text style={styles.successText}>{t.restoreFound}</Text>
          ) : (
            <>
              <Text style={styles.intro}>{t.restoreIntro}</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="tu@correo.com"
                placeholderTextColor={theme.colors.subtext}
                editable={status !== 'checking'}
              />
              {status === 'not-found' && <Text style={styles.errorText}>{t.restoreNotFound}</Text>}
              {status === 'error' && <Text style={styles.errorText}>{t.restoreNetworkError}</Text>}
              <Pressable
                style={[styles.submitButton, { backgroundColor: accentColor }]}
                onPress={handleSubmit}
                disabled={status === 'checking'}
              >
                <Text style={styles.submitButtonText}>
                  {status === 'checking' ? t.restoreChecking : t.restoreSubmit}
                </Text>
              </Pressable>
            </>
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
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(4),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(1.5),
  },
  title: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  closeText: {
    fontWeight: '600',
  },
  intro: {
    color: theme.colors.subtext,
    fontSize: 13,
    marginBottom: theme.spacing(1.5),
  },
  input: {
    backgroundColor: theme.colors.chip,
    borderRadius: 12,
    paddingHorizontal: theme.spacing(1.5),
    paddingVertical: theme.spacing(1),
    color: theme.colors.text,
    fontSize: 15,
  },
  errorText: {
    color: theme.colors.error,
    marginTop: theme.spacing(1),
    fontSize: 13,
  },
  successText: {
    color: theme.colors.text,
    fontSize: 15,
    textAlign: 'center',
    paddingVertical: theme.spacing(3),
  },
  submitButton: {
    borderRadius: theme.radius.chip,
    paddingVertical: theme.spacing(1.5),
    alignItems: 'center',
    marginTop: theme.spacing(2),
  },
  submitButtonText: {
    color: theme.colors.primaryText,
    fontWeight: '700',
    fontSize: 15,
  },
});
