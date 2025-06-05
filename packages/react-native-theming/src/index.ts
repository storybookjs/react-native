/// <reference path="./emotionAugmentation.d.ts" />
import styled, { type StyledComponent } from '@emotion/native';
import { useTheme, withTheme, ThemeProvider } from '@emotion/react';
import { StorybookTheme } from './theme';

export { theme, darkTheme, StorybookTheme } from './theme';

export { styled, useTheme, withTheme, ThemeProvider, StyledComponent };

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Theme extends StorybookTheme {}
