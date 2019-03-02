import { document } from 'global';
import qs from 'qs';
import addons from '@storybook/addons';
import { SELECT_STORY, STORY_CHANGED } from '@storybook/core-events';

import EVENTS from './constants';

export const navigate = params => addons.getChannel().emit(SELECT_STORY, params);
const generateUrl = id => {
  const { location } = document;
  const query = qs.parse(location.search, { ignoreQueryPrefix: true });
  return `${location.origin + location.pathname}?${qs.stringify(
    { ...query, id },
    { encode: false }
  )}`;
};

const valueOrCall = args => value => (typeof value === 'function' ? value(...args) : value);

export const linkTo = (kind, story) => (...args) => {
  const resolver = valueOrCall(args);
  navigate({
    kind: resolver(kind),
    story: resolver(story),
  });
};

export const hrefTo = (kind, name) =>
  new Promise(resolve => {
    const channel = addons.getChannel();
    channel.once(EVENTS.RECEIVE, id => resolve(generateUrl(id)));
    channel.emit(EVENTS.REQUEST, { kind, name });
  });

const linksListener = e => {
  const { sbKind: kind, sbStory: story } = e.target.dataset;
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

export const withLinks = storyFn => {
  on();
  addons.getChannel().once(STORY_CHANGED, off);
  return storyFn();
};
