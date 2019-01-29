export const baseFonts = {
  fontFamily: [
    'Nunito Sans',
    '-apple-system',
    '".SFNSText-Regular"',
    '"San Francisco"',
    'BlinkMacSystemFont, "Segoe UI"',
    '"Helvetica Neue"',
    'Helvetica',
    '"Arial"',
    'sans-serif',
  ].join(', '),
  color: '#444',
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
  color: '#444',
  WebkitFontSmoothing: 'antialiased',
};

export const color = {
  // Official color palette
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

export const background = {
  app: '#F6F9FC',
  appInverse: '#7A8997',

  // Notification, error, and warning backgrounds
  positive: '#E1FFD4',
  negative: '#FEDED2',
  warning: '#FFF5CF',
};

export const typography = {
  weight: {
    regular: '400',
    bold: '700',
    black: '900',
  },
  size: {
    s1: '12',
    s2: '14',
    s3: '16',
    m1: '20',
    m2: '24',
    m3: '28',
    l1: '32',
    l2: '40',
    l3: '48',
    code: '90',
  },
};

export interface Theme {
  colors: {
    [name: string]: string;
  };
  background: {
    [name: string]: string;
  };
  typography: typeof typography;

  mainBackground: string;
  mainBorder: string;
  mainBorderColor: string;
  mainBorderRadius: number;
  mainFill: string;
  mainTextFace: string;
  mainTextColor: string;
  mainTextSize: number;

  monoTextFace: string;

  dimmedTextColor: string;
  inputFill: string;

  barFill: string;
  barTextColor: string;
  barSelectedColor: string;

  layoutMargin: number;

  asideFill: string;
  asideSelected: {
    [key: string]: string | number;
  };
  asideHover: {
    [key: string]: string | number;
  };

  brand: (() => object) | null;

  code: {
    [key: string]: string | object;
  };

  addonActionsTheme: {
    [key: string]: string | object;
  };

  // unknown if still used
  menuHighlightColor: string;
}
