import React, { ReactNode } from 'react';
import { theme } from './theme';

export const ThemeContext = React.createContext(theme);

export const ThemeProvider = ({
  children,
  extendedTheme,
}: {
  children: ReactNode;
  extendedTheme: typeof theme;
}) => {
  return (
    <ThemeContext.Provider value={{ ...theme, ...extendedTheme }}>{children}</ThemeContext.Provider>
  );
};
