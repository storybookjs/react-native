// This generates theme variables in the correct shape for the UI
import lightThemeVars from './themes/light';
import darkThemeVars from './themes/dark';

import { ThemeVars } from './types';

export const themes: { light: ThemeVars; dark: ThemeVars; normal: ThemeVars } = {
  light: lightThemeVars,
  dark: darkThemeVars,
  normal: lightThemeVars,
};

interface Rest {
  [key: string]: any;
}

export const create = (vars: ThemeVars = { base: 'light' }, rest?: Rest): ThemeVars => {
  const inherit: ThemeVars = {
    ...themes.light,
    ...(themes[vars.base] || {}),
    ...vars,
    ...{ base: themes[vars.base] ? vars.base : 'light' },
  };
  return {
    ...rest,
    ...inherit,
    ...{ barSelectedColor: vars.barSelectedColor || inherit.colorSecondary },
  };
};
