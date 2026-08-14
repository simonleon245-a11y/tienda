import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import { theme } from '@/theme';
import { useLanguage } from '@/i18n/LanguageContext';
import { ENV } from '@/utils/env';

interface Props {
  visible: boolean;
  accentColor: string;
  onClose: () => void;
}

type Status = 'idle' | 'sending' | 'success' | 'error';

export default function FeedbackModal({ visible, accentColor, onClose }: Props) {
  const { t } = useLanguage();
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  const handleClose = () => {
    setMessage('');
    setStatus('idle');
    onClose();
  };

  const handleSubmit = async () => {
    if (!message.trim()) {
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
        body: JSON.stringify({ message }),
      });
      if (!res.ok) throw new Error(`Formspree respondió ${res.status}`);
      setStatus('success');
      setMessage('');
    } catch {
      setStatus('error');
    }
  };

  const errorText = !ENV.FORMSPREE_ENDPOINT
    ? t.feedbackNotConfigured
    : !message.trim()
    ? t.feedbackEmptyError
    : t.feedbackError;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <SafeAreaView style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>{t.feedbackModalTitle}</Text>
            <Pressable onPress={handleClose} hitSlop={12}>
              <Text style={[styles.closeText, { color: accentColor }]}>{t.close}</Text>
            </Pressable>
          </View>

          {status === 'success' ? (
            <Text style={styles.successText}>{t.feedbackSuccess}</Text>
          ) : (
            <>
              <TextInput
                style={styles.input}
                placeholder={t.feedbackPlaceholder}
                placeholderTextColor={theme.colors.subtext}
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={5}
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
    marginBottom: theme.spacing(2),
  },
  title: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  closeText: {
    fontWeight: '600',
  },
  input: {
    backgroundColor: theme.colors.chip,
    borderRadius: 12,
    padding: theme.spacing(1.5),
    color: theme.colors.text,
    fontSize: 15,
    minHeight: 120,
    textAlignVertical: 'top',
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
