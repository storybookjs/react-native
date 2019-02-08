import { chromeLight } from 'react-inspector';
import { create as createSyntax } from './light-syntax';

import { baseFonts, monoFonts, color, background, typography, Theme } from '../base';
import { easing, animation } from '../animation';

const main = {
  // App color
  appBgColor: background.app, // TODO implement this

  // Layout
  mainBorderColor: color.border,
  mainBorderRadius: 4,

  // Typography
  mainTextFace: baseFonts.fontFamily,
  monoTextFace: monoFonts.fontFamily,
  mainTextSize: typography.size.s2 - 1, // 13px

  // Text colors (dark on light)
  mainTextColor: color.darkest,
  mainTextBgColor: color.lightest,

  // Text colors (light on dark)
  inverseTextColor: color.lightest,
  inverseTextBgColor: color.mediumdark,
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
