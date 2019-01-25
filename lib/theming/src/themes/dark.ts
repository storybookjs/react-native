import { chromeDark } from 'react-inspector';
import { create as createSyntax } from './light-syntax';

import { Brand } from '../brand';
import { baseFonts, monoFonts } from '../base';

const colors = {
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
};

const mono = {
  monoTextFace: monoFonts.fontFamily,
};

const light = {
  ...main,
  ...bar,
  ...layout,
  ...mono,
  ...aside,
  colors,
  inputFill: 'rgba(0,0,0,0.1)',
  dimmedTextColor: 'rgba(0,0,0,0.4)',
  menuHighlightColor: '#199EFF',
  monoTextFace: monoFonts.fontFamily,
  overlayBackground: 'linear-gradient(to bottom right, rgba(233, 233, 233, 0.6), rgba(255, 255, 255, 0.8))',

  brand: Brand,

  code: createSyntax({ colors, mono }),
  addonActionsTheme: {
    ...chromeDark,
    BASE_FONT_FAMILY: monoFonts.fontFamily,
    BASE_BACKGROUND_COLOR: 'transparent',
  },
};

export default light;
