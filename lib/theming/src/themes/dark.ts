import { chromeDark } from 'react-inspector';
import { mkColor } from '../utils';
import { create as createSyntax } from './dark-syntax';

import { baseFonts, monoFonts } from '../base';

const colors = {
  green1: mkColor('#008000'),
  red1: mkColor('#A31515'),
  red2: mkColor('#9a050f'),
  red3: mkColor('#800000'),
  red4: mkColor('#ff0000'),
  gray1: mkColor('#393A34'),
  cyan1: mkColor('#36acaa'),
  cyan2: mkColor('#2B91AF'),
  blue1: mkColor('#0000ff'),
  blue2: mkColor('#00009f'),
};

const main = {
  mainBackground: '#112 linear-gradient(to right, #112, #333)',
  mainBorder: '1px solid rgba(255,255,255,0.1)',
  mainBorderColor: 'rgba(255,255,255,0.1)',
  mainBorderRadius: 4,
  mainFill: 'rgba(255,255,255,0.1)',
  mainTextFace: baseFonts.fontFamily,
  mainTextColor: '#efefef',
  mainTextSize: 13,
};

const bar = {
  barFill: 'rgba(0,0,0,1)',
  barSelectedColor: 'rgba(255,255,255,0.4)',
};

const layout = {
  layoutMargin: 10,
};

const mono = {
  monoTextFace: monoFonts.fontFamily,
};

const aside = {
  asideFill: 'linear-gradient(to right, rgba(0,0,0,0) 0%,rgba(0,0,0,0) 50%,rgba(0,0,0,0.5) 100%)',
  asideSelected: {
    color: '#9fdaff',
  },
};

const dark = {
  ...main,
  ...bar,
  ...layout,
  ...mono,
  ...aside,
  inputFill: 'rgba(0,0,0,1)',
  dimmedTextColor: 'rgba(255,255,255,0.4)',
  highlightColor: '#9fdaff',
  menuHighlightColor: '#1ea7fd',
  successColor: '#0edf62',
  failColor: '#ff3f3f',
  warnColor: 'orange',
  overlayBackground:
    'linear-gradient(to bottom right, rgba(17, 17, 34, 0.6), rgba(51, 51, 51, 0.8))',

  colors,

  code: createSyntax({ colors, mono }),

  addonActionsTheme: {
    ...chromeDark,
    BASE_FONT_FAMILY: monoFonts.fontFamily,
    BASE_BACKGROUND_COLOR: 'transparent',
  },
};

export default dark;
