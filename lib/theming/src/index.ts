import styled from '@emotion/styled';
import dark from './themes/dark';
import light from './themes/light';

export { styled };

export * from './base';

const themes = {
  dark,
  normal: light,
  light,
};

export { themes };

export * from '@emotion/core';
export * from 'emotion-theming';

export { createGlobal, createReset } from './global';
export * from './create';
export * from './ensure';
