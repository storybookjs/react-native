import { rgba, lighten, darken } from 'polished';

export const mkColor = (color: string) => ({ color });

// Passing linear-gradient string to library polished's functions such as
// lighten or darken throws the error that crashes the entire storybook.
// It needs to be guarded when arguments of those functions are from
// user input.
const isLinearGradient = (color: string) => {
  return typeof color === 'string' && color.includes('linear-gradient');
};

const colorFactory = (type: string) => (color: string) => {
  if (type === 'darken') {
    return isLinearGradient(color) ? color : rgba(`${darken(1, color)}`, 0.95);
  }

  if (type === 'lighten') {
    return isLinearGradient(color) ? color : rgba(`${lighten(1, color)}`, 0.95);
  }

  return color;
};

export const lightenColor = colorFactory('lighten');
export const darkenColor = colorFactory('darken');
