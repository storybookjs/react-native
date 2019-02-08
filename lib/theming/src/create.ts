import { Theme, monoFonts, baseFonts, color, typography } from './base';
import { easing, animation } from './animation';
import { create as createSyntax } from './modules/syntax';

interface Rest {
  [key: string]: any;
}

type TextSize = number | string;

const mono = {
  monoTextFace: monoFonts.fontFamily,
};

interface ThemeVar {
  primary: string;
  secondary: string;
  tertiary: string;
  ancillary: string;

  mainBorderColor: string;
  mainBorderRadius: number;

  // Typography
  mainTextFace: string;
  monoTextFace: string;
  mainTextSize: TextSize;

  // Text colors (dark on light)
  mainAppBackground: string;
  mainTextColor: string;
  mainTextBgColor: string;

  // Text colors (light on dark)
  inverseTextColor: string;
  inverseTextBgColor: string;

  barTextColor: string;
  barSelectedColor: string;

  inputFill: string;
  inputBorder: string;
}

const createColors = (vars: ThemeVar) => ({
  // Official color palette
  primary: vars.primary,
  secondary: vars.secondary,
  tertiary: vars.tertiary,
  ancillary: vars.ancillary,

  orange: '#FC521F',
  gold: '#FFAE00',
  green: '#66BF3C',
  seafoam: '#37D5D3',
  purple: '#6F2CAC',
  ultraviolet: '#2A0481',

  // Monochrome
  lightest: '#FFFFFF',
  lighter: '#F8F8F8',
  light: '#F3F3F3',
  mediumlight: '#EEEEEE',
  medium: '#DDDDDD',
  mediumdark: '#999999',
  dark: '#666666',
  darker: '#444444',
  darkest: '#333333',

  border: 'rgba(0,0,0,.1)',

  // Status
  positive: '#66BF3C',
  negative: '#FF4400',
  warning: '#E69D00',
});

export const create = (vars: ThemeVar, rest?: Rest): Theme => ({
  color: createColors(vars),
  background: {
    app: vars.mainAppBackground,
    preview: color.lightest,
    select: '#e3f3ff',

    // Notification, error, and warning backgrounds
    positive: '#E1FFD4',
    negative: '#FEDED2',
    warning: '#FFF5CF',
  },
  typography: {
    weight: {
      regular: 400,
      bold: 700,
      black: 900,
    },
    size: {
      s1: 12,
      s2: 14,
      s3: 16,
      m1: 20,
      m2: 24,
      m3: 28,
      l1: 32,
      l2: 40,
      l3: 48,
      code: 90,
    },
  },
  animation,
  easing,

  // Layout
  mainBorderColor: color.border,
  mainBorderRadius: 4,

  // Typography
  mainTextFace: baseFonts.fontFamily,
  monoTextFace: monoFonts.fontFamily,
  mainTextSize: typography.size.s2 - 1, // 13px

  // Text colors (dark on light)
  mainTextColor: color.darkest,
  mainTextBgColor: color.lightest,

  // Text colors (light on dark)
  inverseTextColor: color.lightest,
  inverseTextBgColor: color.mediumdark,

  barTextColor: color.mediumdark,
  barSelectedColor: color.secondary,

  layoutMargin: 10,

  inputFill: color.lightest,
  inputBorder: color.border,

  brand: null,

  code: createSyntax({
    colors: {
      green1: '#008000',
      red1: '#A31515',
      red2: '#9a050f',
      red3: '#800000',
      red4: '#ff0000',
      gray1: '#393A34',
      cyan1: '#36acaa',
      cyan2: '#2B91AF',
      blue1: '#0000ff',
      blue2: '#00009f',
    },
    mono,
  }),

  addonActionsTheme: {
    BASE_FONT_FAMILY: monoFonts.fontFamily,
    BASE_FONT_SIZE: '11px',
    BASE_LINE_HEIGHT: '14px',
    BASE_BACKGROUND_COLOR: 'white',
    BASE_COLOR: 'black',
    ARROW_COLOR: '#6e6e6e',
    TREENODE_FONT_FAMILY: monoFonts.fontFamily,
    TREENODE_FONT_SIZE: '11px',
    TREENODE_LINE_HEIGHT: '14px',
    TREENODE_PADDING_LEFT: 12,
  },

  ...(rest || {}),
});
