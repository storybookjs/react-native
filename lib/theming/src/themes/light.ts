import { chromeLight } from 'react-inspector';
import { create as createSyntax } from './light-syntax';

import { baseFonts, monoFonts, color, background, typography, Theme } from '../base';
import { easing, animation } from '../animation';

const main = {
  mainBackground: '#f6f9fc linear-gradient(to bottom right, rgba(0,0,0,0), rgba(0,0,0,0.1))',
  mainBorder: '1px solid rgba(0,0,0,0.1)',
  mainBorderColor: 'rgba(0,0,0,0.1)',
  mainBorderRadius: 4,
  mainFill: 'rgba(255,255,255,0.89)',
  mainTextFace: baseFonts.fontFamily,
  mainTextColor: baseFonts.color,
  mainTextSize: 14,
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

const light: Theme = {
  ...main,
  ...bar,
  ...layout,
  ...mono,
  ...aside,

  // DOM: official global style vars
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
    ...chromeLight,
    BASE_FONT_FAMILY: monoFonts.fontFamily,
    BASE_BACKGROUND_COLOR: 'transparent',
  },
};

export default light;
