import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, StatusBar, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@/theme';
import RecommendationCard from '@/components/RecommendationCard';
import GenrePickerModal from '@/components/GenrePickerModal';
import BannerAd from '@/components/BannerAd';
import MusicLinks from '@/components/MusicLinks';
import WatchProviders from '@/components/WatchProviders';
import PremiumUpsellCard from '@/components/PremiumUpsellCard';
import ColorPickerModal from '@/components/ColorPickerModal';
import LanguagePickerModal from '@/components/LanguagePickerModal';
import { MUSIC_GENRES, MOVIE_GENRES, BOOK_GENRES, genreLabel } from '@/constants/genres';
import { DEFAULT_ACCENT_COLOR, isPremiumColor } from '@/constants/colors';
import { useLanguage } from '@/i18n/LanguageContext';
import {
  getGenrePreferences,
  setGenrePreference,
  getRerollCount,
  incrementRerollCount,
  getAccentColor,
  setAccentColor,
} from '@/services/storage';
import { getDailyAlbum } from '@/services/lastfm';
import { getDailyMovie } from '@/services/tmdb';
import { getMonthlyBook } from '@/services/googleBooks';
import { maybeShowInterstitial } from '@/services/ads';
import { checkPremiumStatus, openUpgradeFlow, FREE_REROLLS_PER_PERIOD } from '@/services/premium';
import { todayKey, monthKey } from '@/utils/dailySeed';
import { showAlert } from '@/utils/alert';
import { AlbumPick, BookPick, Category, GenrePreferences, MoviePick } from '@/types';

type Variants = Record<Category, number>;

interface AsyncSlice<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function daysUntilNextMonth(): number {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const diffMs = nextMonth.getTime() - now.getTime();
  return Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

export default function HomeScreen() {
  const { t, language } = useLanguage();
  const [prefs, setPrefs] = useState<GenrePreferences | null>(null);
  const [album, setAlbum] = useState<AsyncSlice<AlbumPick>>({ data: null, loading: true, error: null });
  const [movie, setMovie] = useState<AsyncSlice<MoviePick>>({ data: null, loading: true, error: null });
  const [book, setBook] = useState<AsyncSlice<BookPick>>({ data: null, loading: true, error: null });
  const [activePicker, setActivePicker] = useState<Category | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [variants, setVariants] = useState<Variants>({ album: 0, movie: 0, book: 0 });
  const [accentColor, setAccentColorState] = useState(DEFAULT_ACCENT_COLOR);
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [languagePickerVisible, setLanguagePickerVisible] = useState(false);

  const loadAlbum = useCallback(
    (genreId: string, variant = 0) => {
      setAlbum({ data: null, loading: true, error: null });
      getDailyAlbum(genreId, variant, language)
        .then((data) => setAlbum({ data, loading: false, error: null }))
        .catch((err) => setAlbum({ data: null, loading: false, error: err.message }));
    },
    [language]
  );

  const loadMovie = useCallback(
    (genreId: string, variant = 0) => {
      setMovie({ data: null, loading: true, error: null });
      getDailyMovie(genreId, variant, language)
        .then((data) => setMovie({ data, loading: false, error: null }))
        .catch((err) => setMovie({ data: null, loading: false, error: err.message }));
    },
    [language]
  );

  const loadBook = useCallback(
    (genreId: string, variant = 0) => {
      setBook({ data: null, loading: true, error: null });
      getMonthlyBook(genreId, variant, language)
        .then((data) => setBook({ data, loading: false, error: null }))
        .catch((err) => setBook({ data: null, loading: false, error: err.message }));
    },
    [language]
  );

  useEffect(() => {
    getGenrePreferences().then((loaded) => {
      setPrefs(loaded);
      loadAlbum(loaded.album);
      loadMovie(loaded.movie);
      loadBook(loaded.book);
    });
    checkPremiumStatus().then(setIsPremium);
    getAccentColor().then(setAccentColorState);
  }, [loadAlbum, loadMovie, loadBook]);

  const handleSelectGenre = async (category: Category, genreId: string) => {
    setActivePicker(null);
    const updated = await setGenrePreference(category, genreId);
    setPrefs(updated);
    setVariants((v) => ({ ...v, [category]: 0 }));
    if (category === 'album') loadAlbum(genreId);
    if (category === 'movie') loadMovie(genreId);
    if (category === 'book') loadBook(genreId);
    maybeShowInterstitial();
  };

  const handleUpgradePress = () => {
    openUpgradeFlow(language).catch((err) =>
      showAlert(t.subscriptionUnavailableTitle, err.message)
    );
  };

  const handleReroll = async (category: Category) => {
    if (!prefs) return;
    const genreId = prefs[category];
    const periodKey = category === 'book' ? monthKey() : todayKey();
    const scopeKey = `${category}:${genreId}:${periodKey}`;

    if (!isPremium) {
      const usedRerolls = await getRerollCount(scopeKey);
      if (usedRerolls >= FREE_REROLLS_PER_PERIOD) {
        showAlert(t.rerollCapTitle, t.rerollCapMessage, [
          { text: t.cancelAction, style: 'cancel' },
          { text: t.viewPremiumAction, onPress: handleUpgradePress },
        ]);
        return;
      }
      await incrementRerollCount(scopeKey);
    }

    const nextVariant = variants[category] + 1;
    setVariants((v) => ({ ...v, [category]: nextVariant }));
    if (category === 'album') loadAlbum(genreId, nextVariant);
    if (category === 'movie') loadMovie(genreId, nextVariant);
    if (category === 'book') loadBook(genreId, nextVariant);
  };

  const handleSelectColor = async (hex: string) => {
    if (isPremiumColor(hex) && !isPremium) return; // por si acaso; la UI ya lo bloquea
    setColorPickerVisible(false);
    setAccentColorState(hex);
    await setAccentColor(hex);
  };

  const handleLockedColorPress = () => {
    showAlert(t.lockedColorTitle, t.lockedColorMessage, [
      { text: t.cancelAction, style: 'cancel' },
      { text: t.viewPremiumAction, onPress: handleUpgradePress },
    ]);
  };

  if (!prefs) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headingRow}>
          <View style={styles.headingTextWrap}>
            <Text style={styles.heading}>{t.appTitle}</Text>
            <Text style={styles.subheading}>{t.appSubtitle}</Text>
          </View>
          <View style={styles.headerButtons}>
            <Pressable style={styles.colorButton} onPress={() => setColorPickerVisible(true)}>
              <View style={[styles.colorSwatch, { backgroundColor: accentColor }]} />
              <Text style={styles.colorButtonText}>{t.colorButtonLabel}</Text>
            </Pressable>
            <Pressable style={styles.colorButton} onPress={() => setLanguagePickerVisible(true)}>
              <Text style={styles.languageFlag}>{language === 'en' ? '🇬🇧' : '🇪🇸'}</Text>
              <Text style={styles.colorButtonText}>{t.languageButtonLabel}</Text>
            </Pressable>
          </View>
        </View>

        <RecommendationCard
          categoryLabel={t.albumTitle}
          frequencyLabel={t.albumFrequency}
          genreLabel={genreLabel(MUSIC_GENRES, prefs.album, language)}
          loading={album.loading}
          error={album.error}
          accentColor={accentColor}
          onChangeGenre={() => setActivePicker('album')}
          onRetry={() => loadAlbum(prefs.album, variants.album)}
          onReroll={() => handleReroll('album')}
        >
          {album.data && (
            <>
              <View style={styles.itemRow}>
                {album.data.coverUrl ? (
                  <Image source={{ uri: album.data.coverUrl }} style={styles.coverSquare} />
                ) : (
                  <View style={[styles.coverSquare, styles.coverPlaceholder]} />
                )}
                <View style={styles.itemText}>
                  <Text style={styles.itemTitle} numberOfLines={2}>
                    {album.data.title}
                  </Text>
                  <Text style={styles.itemSubtitle} numberOfLines={1}>
                    {album.data.artist}
                  </Text>
                </View>
              </View>
              <MusicLinks
                spotifyUrl={album.data.spotifyUrl}
                youtubeMusicUrl={album.data.youtubeMusicUrl}
                amazonMusicUrl={album.data.amazonMusicUrl}
              />
            </>
          )}
        </RecommendationCard>

        <RecommendationCard
          categoryLabel={t.movieTitle}
          frequencyLabel={t.movieFrequency}
          genreLabel={genreLabel(MOVIE_GENRES, prefs.movie, language)}
          loading={movie.loading}
          error={movie.error}
          accentColor={accentColor}
          onChangeGenre={() => setActivePicker('movie')}
          onRetry={() => loadMovie(prefs.movie, variants.movie)}
          onReroll={() => handleReroll('movie')}
        >
          {movie.data && (
            <>
              <View style={styles.itemRow}>
                {movie.data.posterUrl ? (
                  <Image source={{ uri: movie.data.posterUrl }} style={styles.coverPortrait} />
                ) : (
                  <View style={[styles.coverPortrait, styles.coverPlaceholder]} />
                )}
                <View style={styles.itemText}>
                  <Text style={styles.itemTitle} numberOfLines={2}>
                    {movie.data.title} ({movie.data.releaseYear})
                  </Text>
                  <Text style={styles.itemSubtitle} numberOfLines={4}>
                    {movie.data.overview || t.noSynopsis}
                  </Text>
                  <Text style={[styles.ratingText, { color: accentColor }]}>
                    ⭐ {movie.data.rating.toFixed(1)}
                  </Text>
                </View>
              </View>
              <WatchProviders
                providers={movie.data.watchProviders}
                link={movie.data.watchProvidersUrl}
              />
            </>
          )}
        </RecommendationCard>

        <RecommendationCard
          categoryLabel={t.bookTitle}
          frequencyLabel={t.bookFrequency(daysUntilNextMonth())}
          genreLabel={genreLabel(BOOK_GENRES, prefs.book, language)}
          loading={book.loading}
          error={book.error}
          accentColor={accentColor}
          onChangeGenre={() => setActivePicker('book')}
          onRetry={() => loadBook(prefs.book, variants.book)}
          onReroll={() => handleReroll('book')}
        >
          {book.data && (
            <View style={styles.itemRow}>
              {book.data.coverUrl ? (
                <Image source={{ uri: book.data.coverUrl }} style={styles.coverPortrait} />
              ) : (
                <View style={[styles.coverPortrait, styles.coverPlaceholder]} />
              )}
              <View style={styles.itemText}>
                <Text style={styles.itemTitle} numberOfLines={2}>
                  {book.data.title}
                </Text>
                <Text style={styles.itemSubtitle} numberOfLines={1}>
                  {book.data.authors.join(', ')}
                </Text>
                <Text style={styles.itemSubtitle} numberOfLines={4}>
                  {book.data.description}
                </Text>
              </View>
            </View>
          )}
        </RecommendationCard>

        {!isPremium && <PremiumUpsellCard onSubscribe={handleUpgradePress} />}
      </ScrollView>

      {!isPremium && <BannerAd />}

      <GenrePickerModal
        visible={activePicker === 'album'}
        title={t.musicGenreModalTitle}
        genres={MUSIC_GENRES}
        selectedId={prefs.album}
        accentColor={accentColor}
        onSelect={(id) => handleSelectGenre('album', id)}
        onClose={() => setActivePicker(null)}
      />
      <GenrePickerModal
        visible={activePicker === 'movie'}
        title={t.movieGenreModalTitle}
        genres={MOVIE_GENRES}
        selectedId={prefs.movie}
        accentColor={accentColor}
        onSelect={(id) => handleSelectGenre('movie', id)}
        onClose={() => setActivePicker(null)}
      />
      <GenrePickerModal
        visible={activePicker === 'book'}
        title={t.bookGenreModalTitle}
        genres={BOOK_GENRES}
        selectedId={prefs.book}
        accentColor={accentColor}
        onSelect={(id) => handleSelectGenre('book', id)}
        onClose={() => setActivePicker(null)}
      />
      <ColorPickerModal
        visible={colorPickerVisible}
        selectedHex={accentColor}
        isPremium={isPremium}
        accentColor={accentColor}
        onSelect={handleSelectColor}
        onLockedPress={handleLockedColorPress}
        onClose={() => setColorPickerVisible(false)}
      />
      <LanguagePickerModal
        visible={languagePickerVisible}
        accentColor={accentColor}
        onClose={() => setLanguagePickerVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(1),
  },
  headingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing(2.5),
  },
  headingTextWrap: {
    flex: 1,
    paddingRight: theme.spacing(1),
  },
  heading: {
    color: theme.colors.text,
    fontSize: 26,
    fontWeight: '800',
    marginBottom: theme.spacing(0.5),
  },
  subheading: {
    color: theme.colors.subtext,
    fontSize: 14,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: theme.spacing(1),
  },
  colorButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.chip,
    borderRadius: theme.radius.chip,
    paddingHorizontal: theme.spacing(1.25),
    paddingVertical: theme.spacing(0.75),
    gap: 4,
  },
  colorSwatch: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  languageFlag: {
    fontSize: 18,
  },
  colorButtonText: {
    color: theme.colors.subtext,
    fontSize: 11,
    fontWeight: '600',
  },
  itemRow: {
    flexDirection: 'row',
    gap: theme.spacing(1.5),
  },
  coverSquare: {
    width: 88,
    height: 88,
    borderRadius: 10,
  },
  coverPortrait: {
    width: 88,
    height: 132,
    borderRadius: 10,
  },
  coverPlaceholder: {
    backgroundColor: theme.colors.chip,
  },
  itemText: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  itemTitle: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  itemSubtitle: {
    color: theme.colors.subtext,
    fontSize: 13,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
});
