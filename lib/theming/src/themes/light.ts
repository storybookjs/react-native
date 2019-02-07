import { chromeLight } from 'react-inspector';
import { create as createSyntax } from './light-syntax';

import { baseFonts, monoFonts, color, background, typography, Theme } from '../base';
import { easing, animation } from '../animation';

const main = {
  // Typography
  mainTextFace: baseFonts.fontFamily,
  mainTextColor: baseFonts.color,
  mainTextSize: typography.size.s2 - 1, // 13

  // Layout
  mainBorderColor: color.border,
  monoTextFace: monoFonts.fontFamily,
};

const bar = {
  // Toolbars, ActionBars, and other bars
  barFill: color.lightest,
  barTextColor: color.mediumdark,
  barSelectedColor: color.secondary,
};

const layout = {
  layoutMargin: 10,
};

const form = {
  // Style Inputs/Textareas
  inputFill: color.lightest,
  inputBorder: color.border,
};

const sidebar = {
  // Sidebar states
};

const light: Theme = {
  ...main,
  ...bar,
  ...layout,
  ...form,
  ...sidebar,

  // Official global style vars
  // Used in themed components
  color,
  background,
  typography,
  easing,
  animation,

  brand: null,

  addonActionsTheme: {
    ...chromeLight,
    BASE_FONT_FAMILY: monoFonts.fontFamily,
    BASE_BACKGROUND_COLOR: 'transparent',
  },
};

export default light;
