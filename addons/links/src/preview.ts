import { SyntheticEvent } from 'react';
import { document } from 'global';
import qs from 'qs';
import addons from '@storybook/addons';
import { SELECT_STORY, STORY_CHANGED } from '@storybook/core-events';
import { toId } from '@storybook/router';

interface Params {
  kind: string;
  story: string;
}

export const navigate = (params: Params) => addons.getChannel().emit(SELECT_STORY, params);

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
    kind: resolver(kind),
    story: resolver(story),
  });
};

export const hrefTo = (kind: string, name: string): Promise<string> =>
  new Promise(resolve => {
    resolve(generateUrl(toId(kind, name)));
  });

const linksListener = (e: SyntheticEvent<HTMLLinkElement>) => {
  const { sbKind: kind, sbStory: story } = e.currentTarget.dataset;
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
