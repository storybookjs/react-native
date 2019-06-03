import { rgba, lighten, darken } from 'polished';

export const mkColor = (color: string) => ({ color });

// Passing arguments that can't be converted to RGB such as linear-gradient
// to library polished's functions such as lighten or darken throws the error
// that crashes the entire storybook. It needs to be guarded when arguments
// of those functions are from user input.
const isColorVarChangeable = (color: string) => {
  return !!color.match(/(gradient|var)/);
};

const colorFactory = (type: string) => (color: string) => {
  if (type === 'darken') {
    return isColorVarChangeable(color) ? color : rgba(`${darken(1, color)}`, 0.95);
  }

  if (type === 'lighten') {
    return isColorVarChangeable(color) ? color : rgba(`${lighten(1, color)}`, 0.95);
  }

  return color;
};

export const lightenColor = colorFactory('lighten');
export const darkenColor = colorFactory('darken');
