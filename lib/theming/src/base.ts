import { easing, animation } from './animation';

export const baseFonts = {
  fontFamily: [
    '"Nunito Sans"',
    '-apple-system',
    '".SFNSText-Regular"',
    '"San Francisco"',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    '"Helvetica Neue"',
    'Helvetica',
    'Arial',
    'sans-serif',
  ].join(', '),
  WebkitFontSmoothing: 'antialiased',
};

export const monoFonts = {
  fontFamily: [
    '"Operator Mono"',
    '"Fira Code Retina"',
    '"Fira Code"',
    '"FiraCode-Retina"',
    '"Andale Mono"',
    '"Lucida Console"',
    'Consolas',
    'Monaco',
    'monospace',
  ].join(', '),
  WebkitFontSmoothing: 'antialiased',
};

export const color = {
  // Official color palette
  primary: '#FF4785', // coral
  secondary: '#1EA7FD', // ocean
  tertiary: '#FAFBFC',
  ancillary: '#22a699', // for code

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
};

export const background = {
  app: '#F6F9FC',
  preview: color.lightest,
  select: '#e3f3ff',

  // Notification, error, and warning backgrounds
  positive: '#E1FFD4',
  negative: '#FEDED2',
  warning: '#FFF5CF',
};

export const typography = {
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
};

export type Color = typeof color;
export type Background = typeof background;
export type Typography = typeof typography;
export type Easing = typeof easing;
export type Animation = typeof animation;

export interface Theme {
  color: Color;
  background: Background;
  typography: Typography;
  easing: Easing;
  animation: Animation;

  // main
  mainBorderColor: string;
  mainBorderRadius: number;
  mainTextFace: string;
  monoTextFace: string;
  mainTextSize: number;
  mainTextColor: string;
  mainTextBgColor: string;
  inverseTextColor: string;
  inverseTextBgColor: string;

  inputFill: string;

  barTextColor: string;
  barSelectedColor: string;

  layoutMargin: number;

  brand: (() => object) | null;

  code: {
    [key: string]: string | object;
  };

  [key: string]: any;
}
