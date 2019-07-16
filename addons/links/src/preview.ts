import { document, HTMLElement } from 'global';
import qs from 'qs';
import addons from '@storybook/addons';
import { SELECT_STORY, STORY_CHANGED, SET_CURRENT_STORY } from '@storybook/core-events';
import { toId } from '@storybook/router/utils';

interface Params {
  storyId: string;
}

export const navigate = (params: Params) => addons.getChannel().emit(SET_CURRENT_STORY, params);

const generateUrl = (id: string) => {
  const { location } = document;
  const query = qs.parse(location.search, { ignoreQueryPrefix: true });
  return `${location.origin + location.pathname}?${qs.stringify(
    { ...query, id },
    { encode: false }
  )}`;
};

const valueOrCall = (args: string[]) => (value: string | ((...args: string[]) => string)) =>
  typeof value === 'function' ? value(...args) : value;

export const linkTo = (kind: string, story?: string) => (...args: string[]) => {
  const resolver = valueOrCall(args);

  navigate({
    storyId: toId(resolver(kind), resolver(story)),
  });
};

export const hrefTo = (kind: string, name: string): Promise<string> =>
  new Promise(resolve => {
    resolve(generateUrl(toId(kind, name)));
  });

const linksListener = (e: Event) => {
  const { target } = e;
  if (!(target instanceof HTMLElement)) {
    return;
  }
  const element = target as HTMLElement;
  const { sbKind: kind, sbStory: story } = element.dataset;
  if (kind || story) {
    e.preventDefault();
    navigate({ kind, story });
  }
};

let hasListener = false;

const on = () => {
  if (!hasListener) {
    hasListener = true;
    document.addEventListener('click', linksListener);
  }
};
const off = () => {
  if (hasListener) {
    hasListener = false;
    document.removeEventListener('click', linksListener);
  }
};

export const withLinks = (storyFn: () => void) => {
  on();
  addons.getChannel().once(STORY_CHANGED, off);
  return storyFn();
};
