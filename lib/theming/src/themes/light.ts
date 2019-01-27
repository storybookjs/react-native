import { chromeLight } from 'react-inspector';
import { create as createSyntax } from './light-syntax';

import { baseFonts, monoFonts, Theme } from '../base';

const colors = {
  /// Old
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
  highlight: '#1EA7FD',
  warn: '#E69D00',
  fail: '#FF4400',
  success: '#66BF3C',
  white: 'white',
  /// End old

  // Palette
  primary: '#FF4785', // coral
  secondary: '#1EA7FD', // ocean
  tertiary: '#DDDDDD',

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

  border: 'rgba(0,0,0,.05)',

  // Status
  positive: '#66BF3C',
  negative: '#FF4400',
};

const background = {
  app: '#F6F9FC',
  appInverse: '#7A8997',
  positive: '#E1FFD4',
  negative: '#FEDED2',
  warning: '#FFF5CF',
};

const main = {
  mainBackground: '#f6f9fc linear-gradient(to bottom right, rgba(0,0,0,0), rgba(0,0,0,0.1))',
  mainBorder: '1px solid rgba(0,0,0,0.1)',
  mainBorderColor: 'rgba(0,0,0,0.1)',
  mainBorderRadius: 4,
  mainFill: 'rgba(255,255,255,0.89)',
  mainTextFace: baseFonts.fontFamily,
  mainTextColor: baseFonts.color,
  mainTextSize: 13,
};

const bar = {
  barFill: 'rgba(255,255,255,1)',
  barTextColor: colors.mediumdark,
  barSelectedColor: colors.highlight,
};

const layout = {
  layoutMargin: 10,
};

const aside = {
  asideFill: 'transparent',
  asideSelected: {
    background: colors.highlight,
    color: colors.white,
  },
  asideHover: {
    background: '#EAF3FC',
  },
};

const mono = {
  monoTextFace: monoFonts.fontFamily,
};

const light: Theme = {
  ...main,
  ...bar,
  ...layout,
  ...mono,
  ...aside,

  colors,
  background,

  inputFill: 'rgba(0,0,0,0.1)',
  dimmedTextColor: 'rgba(0,0,0,0.4)',
  menuHighlightColor: '#199EFF',
  monoTextFace: monoFonts.fontFamily,

  brand: null,

  code: createSyntax({ colors, mono }),
  addonActionsTheme: {
    ...chromeLight,
    BASE_FONT_FAMILY: monoFonts.fontFamily,
    BASE_BACKGROUND_COLOR: 'transparent',
  },
};

export default light;
