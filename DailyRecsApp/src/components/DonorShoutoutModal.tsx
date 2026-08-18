import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Pressable, StyleSheet, SafeAreaView, ScrollView, Linking } from 'react-native';
import { theme } from '@/theme';
import { useLanguage } from '@/i18n/LanguageContext';
import { ENV } from '@/utils/env';

interface Props {
  visible: boolean;
  accentColor: string;
  onClose: () => void;
}

type Status = 'idle' | 'sending' | 'success' | 'error';

const THANKS_PAGE_URL = 'https://recosdiarias.com/agradecimientos.html';

export default function DonorShoutoutModal({ visible, accentColor, onClose }: Props) {
  const { t } = useLanguage();
  const [displayName, setDisplayName] = useState('');
  const [note, setNote] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  const handleClose = () => {
    setDisplayName('');
    setNote('');
    setStatus('idle');
    onClose();
  };

  const handleSubmit = async () => {
    if (!displayName.trim()) {
      setStatus('error');
      return;
    }
    if (!ENV.FORMSPREE_ENDPOINT) {
      setStatus('error');
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch(ENV.FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: 'Nueva solicitud para la página de agradecimientos',
          type: 'donor-shoutout',
          displayName,
          note,
        }),
      });
      if (!res.ok) throw new Error(`Formspree respondió ${res.status}`);
      setStatus('success');
      setDisplayName('');
      setNote('');
    } catch {
      setStatus('error');
    }
  };

  const errorText = !ENV.FORMSPREE_ENDPOINT
    ? t.donorShoutoutNotConfigured
    : !displayName.trim()
    ? t.donorShoutoutRequiredError
    : t.donorShoutoutError;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <SafeAreaView style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>{t.donorShoutoutModalTitle}</Text>
            <Pressable onPress={handleClose} hitSlop={12}>
              <Text style={[styles.closeText, { color: accentColor }]}>{t.close}</Text>
            </Pressable>
          </View>

          {status === 'success' ? (
            <Text style={styles.successText}>{t.donorShoutoutSuccess}</Text>
          ) : (
            <ScrollView contentContainerStyle={styles.form}>
              <Text style={styles.intro}>{t.donorShoutoutIntro}</Text>

              <Text style={styles.label}>{t.donorShoutoutNameLabel}</Text>
              <TextInput
                style={styles.input}
                value={displayName}
                onChangeText={setDisplayName}
                editable={status !== 'sending'}
              />

              <Text style={styles.label}>{t.donorShoutoutNoteLabel}</Text>
              <TextInput
                style={[styles.input, styles.multiline]}
                value={note}
                onChangeText={setNote}
                multiline
                numberOfLines={3}
                editable={status !== 'sending'}
              />

              {status === 'error' && <Text style={styles.errorText}>{errorText}</Text>}

              <Pressable
                style={[styles.submitButton, { backgroundColor: accentColor }]}
                onPress={handleSubmit}
                disabled={status === 'sending'}
              >
                <Text style={styles.submitButtonText}>
                  {status === 'sending' ? t.feedbackSending : t.feedbackSubmit}
                </Text>
              </Pressable>

              <Pressable onPress={() => Linking.openURL(THANKS_PAGE_URL)}>
                <Text style={[styles.linkText, { color: accentColor }]}>
                  {t.donorShoutoutViewPage}
                </Text>
              </Pressable>
            </ScrollView>
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
    maxHeight: '85%',
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
  form: {
    paddingBottom: theme.spacing(3),
  },
  intro: {
    color: theme.colors.subtext,
    fontSize: 13,
    marginBottom: theme.spacing(2),
  },
  label: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: theme.spacing(0.5),
    marginTop: theme.spacing(1.5),
  },
  input: {
    backgroundColor: theme.colors.chip,
    borderRadius: 12,
    paddingHorizontal: theme.spacing(1.5),
    paddingVertical: theme.spacing(1),
    color: theme.colors.text,
    fontSize: 15,
  },
  multiline: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  errorText: {
    color: theme.colors.error,
    marginTop: theme.spacing(1.5),
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
    marginTop: theme.spacing(2.5),
  },
  submitButtonText: {
    color: theme.colors.primaryText,
    fontWeight: '700',
    fontSize: 15,
  },
  linkText: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    marginTop: theme.spacing(2),
  },
});
