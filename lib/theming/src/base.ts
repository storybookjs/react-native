export const baseFonts = {
  fontFamily: [
    '-apple-system',
    '".SFNSText-Regular"',
    '"San Francisco"',
    'BlinkMacSystemFont, "Segoe UI"',
    '"Roboto"',
    '"Oxygen"',
    '"Ubuntu"',
    '"Cantarell"',
    '"Fira Sans"',
    '"Droid Sans"',
    '"Helvetica Neue"',
    '"Lucida Grande"',
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

export interface Theme {
  colors: {
    [name: string]: string;
  };
  background: {
    [name: string]: string;
  };

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
