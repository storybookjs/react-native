import React, { ComponentType, ReactNode } from 'react';
import { Theme, theme } from './theme';

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

export function withTheme<T>(Component: ComponentType<T & { theme: Theme }>) {
  return (props: T) => {
    return (
      <ThemeContext.Consumer>
        {(contextTheme: Theme) => {
          if (contextTheme === undefined) {
            // eslint-disable-next-line no-console
            console.log('themeConsumer must be used within a themeProvider');
            return <Component {...props} theme={theme} />;
          }
          return <Component {...props} theme={contextTheme} />;
        }}
      </ThemeContext.Consumer>
    );
  };
}
