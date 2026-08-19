// Fondo/superficies neutras (negro/gris carbón, sin tinte cálido) para
// que el contenido (carátulas, pósters) y el color de acento elegido por
// cada usuario destaquen por igual — mismo enfoque que Spotify/Letterboxd.
// La paleta de 13 acentos y los colores de marca externos no cambian.
export const theme = {
  colors: {
    background: '#121214',
    card: '#1B1B1E',
    cardBorder: '#2C2C30',
    primary: '#8B5CF6',
    primaryText: '#FFFFFF',
    text: '#F5F3FF',
    subtext: '#B9AEDD',
    chip: '#232326',
    error: '#F87171',
  },
  spacing: (n: number) => n * 8,
  radius: {
    card: 16,
    chip: 999,
  },
  fonts: {
    heading: 'Poppins_700Bold',
    headingExtraBold: 'Poppins_800ExtraBold',
    semiBold: 'Poppins_600SemiBold',
  },
};
