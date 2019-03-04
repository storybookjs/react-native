// This generates theme variables in the correct shape for the UI
import { chromeLight, chromeDark } from 'react-inspector';
import { opacify } from 'polished';

import { themeVars as lightThemeVars } from './themes/light-vars';
import { themeVars as darkThemeVars } from './themes/dark-vars';

import { Theme, color, Color, background, typography } from './base';
import { easing, animation } from './animation';
import { create as createSyntax } from './modules/syntax';

const base: { light: ThemeVar; dark: ThemeVar } = { light: lightThemeVars, dark: darkThemeVars };

interface Rest {
  [key: string]: any;
}

interface ThemeVar {
  base?: 'light' | 'dark';

  colorPrimary?: string;
  colorSecondary?: string;

  // UI
  appBg?: string;
  appContentBg?: string;
  appBorderColor?: string;
  appBorderRadius?: number;

  // Typography
  fontBase?: string;
  fontCode?: string;

  // Text colors
  textColor?: string;
  textInverseColor?: string;

  // Toolbar default and active colors
  barTextColor?: string;
  barSelectedColor?: string;
  barBg?: string;

  // Form colors
  inputBg?: string;
  inputBorder?: string;
  inputTextColor?: string;
  inputBorderRadius?: number;

  brandTitle?: string;
  brandUrl?: string;
  brandImage?: string;
}

const createColors = (vars: ThemeVar): Color => ({
  // Changeable colors
  primary: vars.colorPrimary,
  secondary: vars.colorSecondary,
  tertiary: color.tertiary,
  ancillary: color.ancillary,

  // Complimentary
  orange: color.orange,
  gold: color.gold,
  green: color.green,
  seafoam: color.seafoam,
  purple: color.purple,
  ultraviolet: color.ultraviolet,

  // Monochrome
  lightest: color.lightest,
  lighter: color.lighter,
  light: color.light,
  mediumlight: color.mediumlight,
  medium: color.medium,
  mediumdark: color.mediumdark,
  dark: color.dark,
  darker: color.darker,
  darkest: color.darkest,

  // For borders
  border: color.border,

  // Status
  positive: color.positive,
  negative: color.negative,
  warning: color.warning,

  defaultText: vars.textColor || color.darkest,
  inverseText: vars.textInverseColor || color.lightest,
});

const lightSyntaxColors = {
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
};

const darkSyntaxColors = {
  green1: '#7C7C7C',
  red1: '#92C379',
  red2: '#9a050f',
  red3: '#A8FF60',
  red4: '#96CBFE',
  gray1: '#EDEDED',
  cyan1: '#C6C5FE',
  cyan2: '#FFFFB6',
  blue1: '#B474DD',
  blue2: '#00009f',
};

function pick<B, K extends keyof B>(b: B, key: K): B[K] {
  return b[key];
}

export const create = (vars: ThemeVar, rest?: Rest): Theme => {
  const inherit: ThemeVar = { ...vars, ...(base[vars.base] || base.light), ...base.light };
  const p = pick.bind(null, inherit);

  return {
    base: vars.base,
    color: createColors(inherit),
    background: {
      app: p('appBg'),
      content: p('appContentBg'),
      hoverable: vars.base === 'light' ? 'rgba(0,0,0,.05)' : 'rgba(250,250,252,.1)' || background.hoverable,

      positive: background.positive,
      negative: background.negative,
      warning: background.warning,
    },
    typography: {
      fonts: {
        base: p('fontBase'),
        mono: p('fontCode'),
      },
      weight: typography.weight,
      size: typography.size,
    },
    animation,
    easing,

    input: {
      border: p('inputBorder'),
      background: p('inputBg'),
      color: p('inputTextColor'),
      borderRadius: p('inputBorderRadius'),
    },

    // UI
    layoutMargin: 10,
    appBorderColor: p('appBorderColor'),
    appBorderRadius: p('appBorderRadius'),

    // Toolbar default/active colors
    barTextColor: p('barTextColor'),
    barSelectedColor: p('barSelectedColor'),
    barBg: p('barBg'),

    // Brand logo/text
    brand: {
      title: p('brandTitle'),
      url: p('brandUrl'),
      image: p('brandImage'),
    },

    code: createSyntax({
      colors: vars.base === 'light' ? lightSyntaxColors : darkSyntaxColors,
      mono: p('fontCode'),
    }),

    // Addon actions theme
    // API example https://github.com/xyc/react-inspector/blob/master/src/styles/themes/chromeLight.js
    addonActionsTheme: {
      ...(vars.base === 'light' ? chromeLight : chromeDark),

      BASE_FONT_FAMILY: p('fontCode'),
      BASE_FONT_SIZE: typography.size.s2 - 1,
      BASE_LINE_HEIGHT: '18px',
      BASE_BACKGROUND_COLOR: 'transparent',
      BASE_COLOR: p('textColor'),
      ARROW_COLOR: opacify(0.2, p('appBorderColor')),
      ARROW_MARGIN_RIGHT: 4,
      ARROW_FONT_SIZE: 8,
      TREENODE_FONT_FAMILY: p('fontCode'),
      TREENODE_FONT_SIZE: typography.size.s2 - 1,
      TREENODE_LINE_HEIGHT: '18px',
      TREENODE_PADDING_LEFT: 12,
    },

    ...(rest || {}),
  };
};
