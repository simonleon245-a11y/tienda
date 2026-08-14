import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Pressable, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { theme } from '@/theme';
import { useLanguage } from '@/i18n/LanguageContext';
import { ENV } from '@/utils/env';

interface Props {
  visible: boolean;
  accentColor: string;
  onClose: () => void;
}

type Status = 'idle' | 'sending' | 'success' | 'error';

const EMPTY_FORM = { bandName: '', albumName: '', genre: '', link: '', description: '', contactEmail: '' };

export default function BandSubmissionModal({ visible, accentColor, onClose }: Props) {
  const { t } = useLanguage();
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState<Status>('idle');

  const setField = (key: keyof typeof EMPTY_FORM) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleClose = () => {
    setForm(EMPTY_FORM);
    setStatus('idle');
    onClose();
  };

  const isMissingRequired = !form.bandName.trim() || !form.albumName.trim() || !form.link.trim();

  const handleSubmit = async () => {
    if (isMissingRequired) {
      setStatus('error');
      return;
    }
    if (!ENV.BAND_SUBMISSION_ENDPOINT) {
      setStatus('error');
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch(ENV.BAND_SUBMISSION_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          bandName: form.bandName,
          albumName: form.albumName,
          genre: form.genre,
          link: form.link,
          description: form.description,
          contactEmail: form.contactEmail,
        }),
      });
      if (!res.ok) throw new Error(`Formspree respondió ${res.status}`);
      setStatus('success');
      setForm(EMPTY_FORM);
    } catch {
      setStatus('error');
    }
  };

  const errorText = !ENV.BAND_SUBMISSION_ENDPOINT
    ? t.bandSubmissionNotConfigured
    : isMissingRequired
    ? t.bandSubmissionRequiredError
    : t.bandSubmissionError;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <SafeAreaView style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>{t.bandSubmissionModalTitle}</Text>
            <Pressable onPress={handleClose} hitSlop={12}>
              <Text style={[styles.closeText, { color: accentColor }]}>{t.close}</Text>
            </Pressable>
          </View>

          {status === 'success' ? (
            <Text style={styles.successText}>{t.bandSubmissionSuccess}</Text>
          ) : (
            <ScrollView contentContainerStyle={styles.form}>
              <Text style={styles.intro}>{t.bandSubmissionIntro}</Text>

              <Text style={styles.label}>{t.bandNameLabel}</Text>
              <TextInput
                style={styles.input}
                value={form.bandName}
                onChangeText={setField('bandName')}
                editable={status !== 'sending'}
              />

              <Text style={styles.label}>{t.albumNameLabel}</Text>
              <TextInput
                style={styles.input}
                value={form.albumName}
                onChangeText={setField('albumName')}
                editable={status !== 'sending'}
              />

              <Text style={styles.label}>{t.bandGenreLabel}</Text>
              <TextInput
                style={styles.input}
                value={form.genre}
                onChangeText={setField('genre')}
                editable={status !== 'sending'}
              />

              <Text style={styles.label}>{t.bandLinkLabel}</Text>
              <TextInput
                style={styles.input}
                value={form.link}
                onChangeText={setField('link')}
                autoCapitalize="none"
                keyboardType="url"
                editable={status !== 'sending'}
              />

              <Text style={styles.label}>{t.bandDescriptionLabel}</Text>
              <TextInput
                style={[styles.input, styles.multiline]}
                value={form.description}
                onChangeText={setField('description')}
                multiline
                numberOfLines={3}
                editable={status !== 'sending'}
              />

              <Text style={styles.label}>{t.bandContactEmailLabel}</Text>
              <TextInput
                style={styles.input}
                value={form.contactEmail}
                onChangeText={setField('contactEmail')}
                autoCapitalize="none"
                keyboardType="email-address"
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
    minHeight: 80,
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
});
