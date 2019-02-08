import { create } from '../create';

import { color, typography, background } from '../base';

export default create({
  // Storybook-specific color palette
  colorPrimary: '#FF4785', // coral
  colorSecondary: '#1EA7FD', // ocean
  colorTertiary: '#FAFBFC', // neutral buttons
  colorAncillary: '#22a699', // for code

  // UI
  appBg: background.app,
  appBorderColor: color.border,
  appBorderRadius: 4,

  // Fonts
  fontBase: typography.fonts.base,
  fontCode: typography.fonts.mono,

  // Text colors
  textColor: color.darkest,
  textInverseColor: color.lightest,

  // Toolbar default and active colors
  barTextColor: color.mediumdark,
  barSelectedColor: color.secondary,
  barBgColor: color.lightest,

  // Form colors
  inputBg: color.lightest,
  inputBorder: color.border,
  inputTextColor: color.darkest,
  inputBorderRadius: 4,

  // Brand logo/text
  brand: null,
});
