import { create } from '../create';

import { color, typography, background } from '../base';

export default create({
  // Storybook-specific color palette
  colorPrimary: '#FF4785', // coral
  colorSecondary: '#1EA7FD', // ocean
  // colorTertiary: '#FAFBFC', // neutral buttons
  // colorAncillary: '#22a699', // for code

  // UI colors
  appBg: background.app,
  // bgHoverItem: background.hoverable,
  appBorderColor: color.border,
  appBorderRadius: 4,

  // Typography
  fontBase: typography.fonts.base,
  fontCode: typography.fonts.mono,
  // mainTextSize: typography.size.s2 - 1, // 13px

  // Text colors (dark on light)

  textColor: color.darkest,
  textInverseColor: color.lightest,

  // Text colors (light on dark)
  // inverseTextColor: color.lightest,
  // inverseTextBgColor: color.mediumdark,

  barTextColor: color.mediumdark,
  barSelectedColor: color.secondary,

  inputBg: color.lightest,
  inputBorder: color.border,
});
