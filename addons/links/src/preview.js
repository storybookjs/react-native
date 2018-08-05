import { document } from 'global';
import addons from '@storybook/addons';
import Events from '@storybook/core-events';

import { EVENT_ID, REQUEST_HREF_EVENT_ID, RECEIVE_HREF_EVENT_ID } from './events';

export const openLink = params => addons.getChannel().emit(EVENT_ID, params);

const valueOrCall = args => value => (typeof value === 'function' ? value(...args) : value);

export const linkTo = (kind, story) => (...args) => {
  const resolver = valueOrCall(args);
  openLink({
    kind: resolver(kind),
    story: resolver(story),
  });
};

export const hrefTo = (kind, story) =>
  new Promise(resolve => {
    const channel = addons.getChannel();
    channel.on(RECEIVE_HREF_EVENT_ID, resolve);
    channel.emit(REQUEST_HREF_EVENT_ID, { kind, story });
  });

const linksListener = e => {
  const { sbKind, sbStory } = e.target.dataset;
  if (sbKind || sbStory) {
    e.preventDefault();
    linkTo(sbKind, sbStory)();
  }
};

const linkSubscribtion = () => {
  document.addEventListener('click', linksListener);
  return () => document.removeEventListener('click', linksListener);
};

export const withLinks = story => {
  addons.getChannel().emit(Events.REGISTER_SUBSCRIPTION, linkSubscribtion);
  return story();
};
