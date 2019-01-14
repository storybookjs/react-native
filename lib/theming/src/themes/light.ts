import { chromeLight } from 'react-inspector';
import { create as createSyntax } from './light-syntax';

import { Brand } from '../brand';
import { baseFonts, monoFonts } from '../base';

import { mkColor } from '../utils';

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
  barSelectedColor: 'rgba(0,0,0,0.1)',
};

const layout = {
  layoutMargin: 10,
};

const aside = {
  asideFill: 'transparent',
  asideSelected: {
    color: '#9fdaff',
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
  inputFill: 'rgba(0,0,0,0.1)',
  dimmedTextColor: 'rgba(0,0,0,0.4)',
  highlightColor: '#9fdaff',
  menuHighlightColor: '#1ea7fd',
  successColor: '#09833a',
  failColor: '#d53535',
  warnColor: 'orange',
  monoTextFace: monoFonts.fontFamily,
  overlayBackground: 'linear-gradient(to bottom right, rgba(233, 233, 233, 0.6), rgba(255, 255, 255, 0.8))',

  brand: Brand,

  code: createSyntax({ colors, mono }),
  addonActionsTheme: {
    ...chromeLight,
    BASE_FONT_FAMILY: monoFonts.fontFamily,
    BASE_BACKGROUND_COLOR: 'transparent',
  },
};

export default light;
