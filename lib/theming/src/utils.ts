import { rgba, lighten, darken } from 'polished';

export const mkColor = (color: string) => ({ color });

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
