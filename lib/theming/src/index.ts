import emotionStyled, { CreateStyled } from '@emotion/styled';
import { Theme } from './types';

export const styled = emotionStyled as CreateStyled<Theme>;

export * from './base';
export * from './types';

export * from '@emotion/core';
export * from 'emotion-theming';

export { createGlobal, createReset } from './global';
export * from './create';
export * from './convert';
export * from './ensure';

export { lightenColor as lighten, darkenColor as darken } from './utils';
