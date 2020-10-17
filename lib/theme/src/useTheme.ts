import React, { useContext } from 'react';
import { ThemeContext } from './ThemeProvider';

export function useTheme() {
  const theme = useContext(ThemeContext);
  return theme;
}
