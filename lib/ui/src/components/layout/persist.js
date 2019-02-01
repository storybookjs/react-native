import { localStorage } from 'global';
import debounce from 'lodash.debounce';
import memoize from 'memoizerific';

export const get = () => {
  try {
    const rawValue = localStorage.getItem(`storybook-layout`);
    return rawValue ? JSON.parse(rawValue) : false;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return false;
  }
};

const write = memoize(1)(changes => {
  try {
    localStorage.setItem(`storybook-layout`, JSON.stringify(changes));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
});

export const set = debounce(write, 500);
