import { create } from '../create';

import { color, baseFonts, monoFonts, typography, background } from '../base';

export default create({
  primary: '#FF4785', // coral
  secondary: '#1EA7FD', // ocean
  tertiary: '#FAFBFC',
  ancillary: '#22a699', // for code

  mainBorderColor: color.border,
  mainBorderRadius: 4,

  // Typography
  mainTextFace: baseFonts.fontFamily,
  monoTextFace: monoFonts.fontFamily,
  mainTextSize: typography.size.s2 - 1, // 13px

  // Text colors (dark on light)
  mainAppBackground: background.app,
  mainTextColor: color.darkest,
  mainTextBgColor: color.lightest,

  // Text colors (light on dark)
  inverseTextColor: color.lightest,
  inverseTextBgColor: color.mediumdark,

  barTextColor: color.mediumdark,
  barSelectedColor: color.secondary,

  inputFill: color.lightest,
  inputBorder: color.border,
});
