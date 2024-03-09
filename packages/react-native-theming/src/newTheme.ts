import type { TextStyle } from 'react-native';

export const color = {
  // Official color palette
  primary: '#FF4785', // coral
  secondary: '#029CFD', // ocean
  secondaryLighter: 'rgba(2, 157, 253, 0.9)', // ocean
  tertiary: '#FAFBFC',
  ancillary: '#22a699',

  // Complimentary
  orange: '#FC521F',
  gold: '#FFAE00',
  green: '#66BF3C',
  seafoam: '#37D5D3',
  purple: '#6F2CAC',
  ultraviolet: '#2A0481',

  // Monochrome
  lightest: '#FFFFFF',
  lighter: '#F7FAFC',
  light: '#EEF3F6',
  mediumlight: '#ECF4F9',
  medium: '#D9E8F2',
  mediumdark: '#73828C',
  dark: '#5C6870',
  darker: '#454E54',
  darkest: '#2E3438',

  // For borders
  border: 'hsla(203, 50%, 30%, 0.15)',

  // Status
  positive: '#66BF3C',
  negative: '#FF4400',
  warning: '#E69D00',
  critical: '#FFFFFF',

  // Text
  defaultText: '#2E3438',
  inverseText: '#FFFFFF',
  positiveText: '#448028',
  negativeText: '#D43900',
  warningText: '#A15C20',
};

export const background = {
  app: '#F6F9FC',
  bar: color.lightest,
  content: color.lightest,
  preview: color.lightest,
  gridCellSize: 10,
  hoverable: color.secondaryLighter, // hover state for items in a list

  // Notification, error, and warning backgrounds
  positive: '#E1FFD4',
  negative: '#FEDED2',
  warning: '#FFF5CF',
  critical: '#FF4400',
};

export const typography = {
  weight: {
    regular: '400' as TextStyle['fontWeight'],
    bold: '700' as TextStyle['fontWeight'],
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
};

export interface ThemeVars extends ThemeVarsBase, ThemeVarsColors {}

export interface ThemeVarsPartial extends ThemeVarsBase, Partial<ThemeVarsColors> {}

interface ThemeVarsBase {
  base: 'light' | 'dark';
}

export const light: ThemeVars = {
  base: 'light',

  // Storybook-specific color palette
  colorPrimary: '#FF4785', // coral
  colorSecondary: '#029CFD', // ocean

  // UI
  appBg: background.app,
  appContentBg: color.lightest,
  appPreviewBg: color.lightest,
  appBorderColor: color.border,
  appBorderRadius: 4,

  // Fonts

  // Text colors
  textColor: color.darkest,
  textInverseColor: color.lightest,
  textMutedColor: color.dark,

  // Toolbar default and active colors
  barTextColor: color.mediumdark,
  barHoverColor: color.secondary,
  barSelectedColor: color.secondary,
  barBg: color.lightest,

  // Form colors
  buttonBg: background.app,
  buttonBorder: color.medium,
  booleanBg: color.mediumlight,
  booleanSelectedBg: color.lightest,
  inputBg: color.lightest,
  inputBorder: color.border,
  inputTextColor: color.darkest,
  inputBorderRadius: 4,
};

export interface ThemeVarsColors {
  colorPrimary: string;
  colorSecondary: string;

  // UI
  appBg: string;
  appContentBg: string;
  appPreviewBg: string;
  appBorderColor: string;
  appBorderRadius: number;

  // Text colors
  textColor: string;
  textInverseColor: string;
  textMutedColor: string;

  // Toolbar default and active colors
  barTextColor: string;
  barHoverColor: string;
  barSelectedColor: string;
  barBg: string;

  // Form colors
  buttonBg: string;
  buttonBorder: string;
  booleanBg: string;
  booleanSelectedBg: string;
  inputBg: string;
  inputBorder: string;
  inputTextColor: string;
  inputBorderRadius: number;

  brandTitle?: string;
  brandUrl?: string;
  brandImage?: string;
  brandTarget?: string;

  gridCellSize?: number;
}

export type Color = typeof color;
export type Background = typeof background;
export type Typography = typeof typography;

export type TextSize = number | string;
export interface Brand {
  title: string | undefined;
  url: string | null | undefined;
  image: string | null | undefined;
  target: string | null | undefined;
}

export interface StorybookThemeWeb {
  color: Color;
  background: Background;
  typography: Typography;

  input: {
    border: string;
    background: string;
    color: string;
    borderRadius: number;
  };

  // UI
  layoutMargin: number;
  appBorderColor: string;
  appBorderRadius: number;

  // Toolbar default/active colors
  barTextColor: string;
  barHoverColor: string;
  barSelectedColor: string;
  barBg: string;

  brand: Brand;

  [key: string]: any;
}

export const dark: ThemeVars = {
  base: 'dark',

  // Storybook-specific color palette
  colorPrimary: '#FF4785', // coral
  colorSecondary: '#029CFD', // ocean

  // UI
  appBg: '#222425',
  appContentBg: '#1B1C1D',
  appPreviewBg: color.lightest,
  appBorderColor: 'rgba(255,255,255,.1)',
  appBorderRadius: 4,

  // Text colors
  textColor: '#C9CDCF',
  textInverseColor: '#222425',
  textMutedColor: '#798186',

  // Toolbar default and active colors
  barTextColor: '#798186',
  barHoverColor: color.secondary,
  barSelectedColor: color.secondary,
  barBg: '#292C2E',

  // Form colors
  buttonBg: '#222425',
  buttonBorder: 'rgba(255,255,255,.1)',
  booleanBg: '#222425',
  booleanSelectedBg: '#2E3438',
  inputBg: '#1B1C1D',
  inputBorder: 'rgba(255,255,255,.1)',
  inputTextColor: color.lightest,
  inputBorderRadius: 4,
};
