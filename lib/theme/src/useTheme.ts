import React, { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

export function useTheme() {
  const theme = useContext(ThemeContext);
  return theme;
}
