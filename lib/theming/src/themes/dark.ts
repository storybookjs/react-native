import { chromeDark } from 'react-inspector';
import { create as createSyntax } from './light-syntax';

import { baseFonts, monoFonts, color, Theme, typography } from '../base';
import { easing, animation } from '../animation';

const background = {
  app: '#F6F9FC',
  appInverse: '#7A8997',
  select: '#e3f3ff',
  positive: '#E1FFD4',
  negative: '#FEDED2',
  warning: '#FFF5CF',
};

const main = {
  mainBackground: '#1F1F1F',
  mainBorder: '1px solid rgba(255, 255, 255, 0.1)',
  mainBorderColor: 'rgba(255, 255, 255, 0.1)',
  mainBorderRadius: 4,
  mainFill: 'rgba(255,255,255,0.01)',
  mainTextFace: baseFonts.fontFamily,
  mainTextColor: '#efefef',
  mainTextSize: 13,
};

const bar = {
  barFill: 'rgba(255,255,255,1)',
  barTextColor: color.mediumdark,
  barSelectedColor: color.secondary,
};

const layout = {
  layoutMargin: 10,
};

const aside = {
  asideFill: 'transparent',
  asideSelected: {
    background: color.secondary,
    color: color.lightest,
  },
  asideHover: {
    background: '#EAF3FC',
  },
};

const mono = {
  monoTextFace: monoFonts.fontFamily,
};

const dark: Theme = {
  ...main,
  ...bar,
  ...layout,
  ...mono,
  ...aside,

  color,
  background,
  typography,
  easing,
  animation,

  inputFill: 'rgba(0,0,0,0.1)',
  dimmedTextColor: 'rgba(0,0,0,0.4)',
  menuHighlightColor: '#199EFF',
  monoTextFace: monoFonts.fontFamily,

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
    ...chromeDark,
    BASE_FONT_FAMILY: monoFonts.fontFamily,
    BASE_BACKGROUND_COLOR: 'transparent',
  },
};

export default dark;
