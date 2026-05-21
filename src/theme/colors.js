export const COLORS = {
  background: '#FAFAFA',      // Calming off-white background
  surface: '#FFFFFF',         // Pure white for cards and floating elements
  primary: '#7C9D96',         // Calm sage green accent
  primaryDark: '#5E7D77',     // Darker sage for active states
  primaryLight: '#E8F1EE',    // Super light sage for pill fills/accents
  textPrimary: '#2C3E35',     // Deep forest/slate grey for headers & body
  textSecondary: '#8A9A93',   // Muted slate-green for captions & subtitles
  border: '#ECEFEF',          // Subtle light border
  borderDark: '#D5DFDD',      // Darker border for hover/active input outline
  danger: '#D98880',          // Soft dusty rose/coral for destructive/stop buttons
  dangerLight: '#FDEDEC',     // Light background for destructive items
  success: '#82C4A2',         // Soft pastel green for completed stats
  warning: '#F9E79F',         // Soft yellow
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const TYPOGRAPHY = {
  fontFamily: 'System',
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 36,
    jumbo: 72,
  },
  weights: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  }
};

export const SHADOWS = {
  light: {
    shadowColor: '#7C9D96',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  medium: {
    shadowColor: '#2C3E35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  }
};
