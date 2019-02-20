import light from './themes/light';
import { Theme } from './base';

export const ensure = (input: any): Theme => ({
  base: input.base,
  color: input.colors || light.colors,
  background: input.background || light.background,
  typography: input.typography || light.typography,
  animation: input.animation || light.animation,
  easing: input.easing || light.easing,

  input: input.input || light.input,

  // UI
  layoutMargin: input.layoutMargin || light.layoutMargin,
  appBorderColor: input.appBorderColor || light.appBorderColor,
  appBorderRadius: input.appBorderRadius || light.appBorderRadius,

  // Toolbar default/active colors
  barTextColor: input.barTextColor || light.barTextColor,
  barSelectedColor: input.barSelectedColor || light.barSelectedColor,
  barBg: input.barBg || light.barBg,

  // Brand logo/text
  brand: input.brand || light.brand,

  code: input.code || light.code,

  // Addon actions theme
  // API example https://github.com/xyc/react-inspector/blob/master/src/styles/themes/chromeLight.js
  addonActionsTheme: input.addonActionsTheme || light.addonActionsTheme,
});
