import { create } from '../create';
import { themeVars } from './dark-vars';

export default create({
  // Is this a light theme or a dark theme?
  base: 'dark',

  ...themeVars,
});
