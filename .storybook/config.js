import * as storybook from '@kadira/storybook';
import { setOptions } from '../preview';

setOptions({
  name : 'CUSTOM-OPTIONS',
  url: 'https://github.com/kadirahq/storybook-addon-options',
});

storybook.configure(() => require('./stories'), module);
