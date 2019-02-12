import { create } from '../create';

import { color, typography, background } from '../base';

// export default create({
//   base: 'light',
//   // Storybook-specific color palette
//   colorPrimary: '#FF4785', // coral
//   colorSecondary: '#1EA7FD', // ocean
//
//   // UI
//   appBg: background.app,
//   appContentBg: color.lightest,
//   appBorderColor: color.border,
//   appBorderRadius: 4,
//
//   // Fonts
//   fontBase: typography.fonts.base,
//   fontCode: typography.fonts.mono,
//
//   // Text colors
//   textColor: color.darkest,
//   textInverseColor: color.lightest,
//
//   // Toolbar default and active colors
//   barTextColor: color.mediumdark,
//   barSelectedColor: color.secondary,
//   barBg: color.lightest,
//
//   // Form colors
//   inputBg: color.lightest,
//   inputBorder: color.border,
//   inputTextColor: color.darkest,
//   inputBorderRadius: 4,
//
//   // Brand logo/text
//   brand: null,
// });

export default create({
  base: 'dark',

  // Storybook-specific color palette
  colorPrimary: '#FF4785', // coral
  colorSecondary: '#1EA7FD', // ocean
  colorTertiary: '#373737',

  // UI
  appBg: '#2f2f2f',
  appContentBg: '#333',
  appBorderColor: 'rgba(255,255,255,.1)',
  appBorderRadius: 4,

  // Fonts
  fontBase: typography.fonts.base,
  fontCode: typography.fonts.mono,

  // Text colors
  textColor: color.lightest,
  textInverseColor: color.darkest,

  // Toolbar default and active colors
  barTextColor: '#999999',
  barSelectedColor: color.secondary,
  barBg: color.darkest,

  // Form colors
  inputBg: '#3f3f3f',
  inputBorder: 'rgba(0,0,0,.3)',
  inputTextColor: color.lightest,
  inputBorderRadius: 4,

  // Brand logo/text
  brand: null,
});
