// This generates theme variables in the correct shape for the UI
import lightThemeVars from './themes/light';
import darkThemeVars from './themes/dark';

import { ThemeVars } from './types';
import { getPreferredColorScheme } from './utils';

export const themes: { light: ThemeVars; dark: ThemeVars; normal: ThemeVars } = {
  light: lightThemeVars,
  dark: darkThemeVars,
  normal: lightThemeVars,
};

interface Rest {
  [key: string]: any;
}

const preferredColorScheme = getPreferredColorScheme();

export const create = (
  vars: ThemeVars = { base: preferredColorScheme },
  rest?: Rest
): ThemeVars => {
  const inherit: ThemeVars = {
    ...themes[preferredColorScheme],
    ...(themes[vars.base] || {}),
    ...vars,
    ...{ base: themes[vars.base] ? vars.base : preferredColorScheme },
  };
  return {
    ...rest,
    ...inherit,
    ...{ barSelectedColor: vars.barSelectedColor || inherit.colorSecondary },
  };
};
