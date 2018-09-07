import { chromeDark, chromeLight } from 'react-inspector';
import { dark as darkSyntax, light as lightSyntax } from './syntaxhighlighter/themes';

const logo = `url('data:image/svg+xml;utf8, <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2023.2 538" width="500" version="1.1" class="css-twuco8-Svg ezlaqq40"><path d="m 2006.8,206.4 -68.8,-9.2 c 0,0 -24,35.6 -57.2,76.6 5.2,-93.8 12,-156.6 12,-156.6 l -72,-6.6 c 0,0 -8,162.8 -9.6,292 30,3.6 64.6,3.6 64.6,3.6 l 2.2,-77.4 c 32.6,37 69.2,75.2 69.2,75.2 l 76,-12.2 c -44,-44 -74,-74.8 -88.4,-94.2 16.8,-22.4 46.6,-58 72.2,-91.2 z" fill="#b57ee5"></path><path d="m 1688.4,192 c -66.8,0 -95.4,53.6 -95.4,117.4 0,54 26.4,94.6 89.2,94.6 70.4,0 95.6,-52.8 95.6,-114 0,-56.6 -24.6,-98 -89.4,-98 z m 23.4,106.4 c 0,28.6 -9.8,50.6 -29.6,50.6 -16.6,0 -23.2,-19.4 -23.2,-39.6 0,-32.6 11.4,-57.6 29.4,-57.6 18.6,0 23.4,24.2 23.4,46.6 z" fill="#a2e05e"></path><path d="m 1479.2,192 c -66.8,0 -95.4,53.6 -95.4,117.4 0,54 26.4,94.6 89.2,94.6 70.4,0 95.6,-52.8 95.6,-114 0,-56.6 -24.8,-98 -89.4,-98 z m 23.4,106.4 c 0,28.6 -9.8,50.6 -29.6,50.6 -16.6,0 -23.2,-19.4 -23.2,-39.6 0,-32.6 11.4,-57.6 29.4,-57.6 18.4,0 23.4,24.2 23.4,46.6 z" fill="#6dabf5"></path><path d="m 1246,403.2 c 0,-9.8 1,-18.6 1,-22 7.4,11 22,20.6 40,20.6 50.6,0 72.6,-49.6 74,-108.6 0.8,-56 -20.4,-102.6 -67,-102.6 -17.2,0 -31.6,9.2 -39.6,19 4,-65.6 7,-107.4 7,-107.4 L 1195,97.4 c -4,45.8 -10,197 -9.2,307.6 38.2,0.8 60.2,-2 60.2,-2 z m 4,-87.6 c -0.8,-12 -3,-64.6 22.4,-64.6 18,0 22.4,22 21.6,44 -0.4,23.6 -5.2,50.6 -23.8,50.6 -12.8,0 -18.8,-9.4 -20,-30 z" fill="#f16161"></path><path d="m 1148,192.4 h -65.4 V 229 c 0,47 -0.6,84.8 -0.6,84.8 0,23.4 -9.6,29.6 -22,29.6 -12.6,0 -19.2,-5.8 -19.2,-30.4 0,-36 2.6,-107.4 2.6,-107.4 l -65.6,-1.8 c 0,-0.8 -2.2,54.6 -2.2,120 0,65.8 41.4,70.6 60.2,70.6 18,0 38,-7 48.4,-18.6 0,37.4 -11.8,49.8 -38.2,49.8 -16.8,0 -37,-8.4 -48,-17.6 v 60.2 c 18.1744,10.68686 38.9176,16.2184 60,16 44,0 87,-25.6 88,-99 1.2,-82 1.6,-163.8 2,-192.8 z" fill="#6dabf5"></path><path d="m 892.6,219.2 c 0,-6.6 0.4,-13.6 0.8,-20.6 l -61.2,-2.2 c 0,0 -5.6,89.8 -5.2,207.6 29.4,2.2 63.8,2.2 63.8,2.2 -0.4,0 0,-39.2 1.8,-98 0.8,-34.4 13.2,-45 31.6,-45 11,0 24.6,4.8 24.6,4.8 l 7.2,-61 c -28.6,-9.8 -55,-1.4 -63.4,12.2 z" fill="#b57ee6"></path><path d="m 706,192 c -66.8,0 -95.4,53.6 -95.4,117.4 0,54 26.4,94.6 89.4,94.6 70.4,0 95.4,-52.8 95.4,-114 0,-56.6 -24.6,-98 -89.2,-98 z m 23.4,106.4 c 0,28.6 -9.6,50.6 -29.4,50.6 -16.8,0 -23.4,-19.4 -23.4,-39.6 0,-32.6 11.6,-57.6 29.6,-57.6 18.4,0 23.2,24.2 23.2,46.6 z" fill="#a2e05e"></path><path d="m 495.4,404.4 c 34,0.6 66.4,-4 66.4,-4 0,-57.6 0,-111.6 0.4,-152.6 17.6,-1.8 32,-4 32,-4 1,-27.6 -1.2,-52.8 -1.2,-52.8 l -30,2 c 1,-42 2,-63.6 2,-63.6 l -70.8,4.6 c 0,0 0,26 0.6,65.6 -21.4,2.4 -37.2,6.8 -37.2,6.8 0.8,23.6 9.2,48.4 9.2,48.4 l 28.6,-1.2 z" fill="#f3ad38"></path><path d="M 420,0 372,3.42774 V 72 L 348.4004,50.5996 320,72 324.8652,6.79492 28,28 52,520 420,538 Z M 230,96.80078 c 67.6,0 106.5996,37.19884 104.5996,111.79882 l -77.4004,2 v -0.1992 c 1.6,-40 -15.7984,-44 -25.3984,-44 -9,0 -24.4004,2.8004 -24.4004,24.4004 0,53.4 131.4004,50.4 131.4004,158 0,60.4 -46.8008,88.39844 -106.8008,88.39844 -62,0 -116.4,-21.19884 -110,-113.79884 h 81 c -1,37.4 7.2008,50.79884 27.8008,50.79884 16,0 23.1992,-8.99844 23.1992,-24.39844 0,-54.8 -129.5996,-56.6 -129.5996,-157 0,-57.6 37.5996,-96 105.5996,-96 z" fill="#f1618c"></path><path d="M 42,520 18,28 H 0 l 18,492 z" fill="#b57ee5"></path></svg>')`;

export const baseFonts = {
  fontFamily:
    '-apple-system, ".SFNSText-Regular", "San Francisco", BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", "Lucida Grande", "Arial", sans-serif',
  color: '#444',
  WebkitFontSmoothing: 'antialiased',
};

export const monoFonts = {
  fontFamily:
    '"Operator Mono", "Fira Code Retina", "Fira Code", "FiraCode-Retina", "Andale Mono", "Lucida Console", Consolas, Monaco, monospace',
  color: '#444',
  WebkitFontSmoothing: 'antialiased',
};

export const normal = {
  mainBackground: '#F7F7F7 linear-gradient(to bottom right, #EEEEEE, #FFFFFF)',
  mainBorder: '1px solid rgba(0,0,0,0.1)',
  mainBorderColor: 'rgba(0,0,0,0.1)',
  mainBorderRadius: 4,
  mainFill: 'rgba(255,255,255,0.89)',
  barFill: 'rgba(255,255,255,1)',
  asideFill: 'rgba(0,0,0,0.05)',
  asideStripe: 'rgba(0,0,0,0.05)',
  barSelectedColor: 'rgba(0,0,0,0.1)',
  inputFill: 'rgba(0,0,0,0.05)',
  mainTextFace: baseFonts.fontFamily,
  mainTextColor: baseFonts.color,
  dimmedTextColor: 'rgba(0,0,0,0.4)',
  highlightColor: '#9fdaff',
  successColor: '#0edf62',
  failColor: '#ff3f3f',
  warnColor: 'orange',
  mainTextSize: 13,
  monoTextFace: monoFonts.fontFamily,
  layoutMargin: 10,
  overlayBackground:
    'linear-gradient(to bottom right, rgba(233, 233, 233, 0.6), rgba(255, 255, 255, 0.8))',

  brand: {
    width: '100%',
    height: 40,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '0 0',
    backgroundImage: logo,
  },

  code: lightSyntax,
  addonActionsTheme: {
    ...chromeLight,
    BASE_FONT_FAMILY: monoFonts.fontFamily,
    BASE_BACKGROUND_COLOR: 'transparent',
  },
};

export const dark = {
  mainBackground: '#112 linear-gradient(to right, #112, #333)',
  mainBorder: '1px solid rgba(255,255,255,0.1)',
  mainBorderColor: 'rgba(255,255,255,0.1)',
  mainBorderRadius: 4,
  mainFill: 'rgba(255,255,255,0.1)',
  barFill: 'rgba(0,0,0,1)',
  asideFill: 'linear-gradient(to right, rgba(0,0,0,0) 0%,rgba(0,0,0,0) 50%,rgba(0,0,0,0.5) 100%)',
  asideStripe: 'rgba(0,0,0,0.5)',
  asideSelected: {
    color: '#9fdaff',
  },
  barSelectedColor: 'rgba(255,255,255,0.4)',
  inputFill: 'rgba(0,0,0,1)',
  mainTextFace: baseFonts.fontFamily,
  mainTextColor: '#efefef',
  dimmedTextColor: 'rgba(255,255,255,0.4)',
  highlightColor: '#9fdaff',
  successColor: '#0edf62',
  failColor: '#ff3f3f',
  warnColor: 'orange',
  mainTextSize: 13,
  monoTextFace: monoFonts.fontFamily,
  layoutMargin: 10,
  overlayBackground:
    'linear-gradient(to bottom right, rgba(17, 17, 34, 0.6), rgba(51, 51, 51, 0.8))',

  brand: {
    width: '100%',
    height: 40,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '0 0',
    backgroundImage: logo,
  },

  code: darkSyntax,

  addonActionsTheme: {
    ...chromeDark,
    BASE_FONT_FAMILY: monoFonts.fontFamily,
    BASE_BACKGROUND_COLOR: 'transparent',
  },
};
