// Based on http://backbonejs.org/docs/backbone.html#section-164
import { document, Element } from 'global';
import isEqual from 'lodash/isEqual';
import addons from '@storybook/addons';
import Events from '@storybook/core-events';

import actions from './actions';

let lastSubscription;
let lastArgs;

const delegateEventSplitter = /^(\S+)\s*(.*)$/;

const isIE = Element != null && !Element.prototype.matches;
const matchesMethod = isIE ? 'msMatchesSelector' : 'matches';

const root = document && document.getElementById('root');

const hasMatchInAncestry = (element, selector) => {
  if (element[matchesMethod](selector)) {
    return true;
  }
  const parent = element.parentElement;
  if (!parent) {
    return false;
  }
  return hasMatchInAncestry(parent, selector);
};

const createHandlers = (actionsFn, ...args) => {
  const actionsObject = actionsFn(...args);
  return Object.entries(actionsObject).map(([key, action]) => {
    // eslint-disable-next-line no-unused-vars
    const [_, eventName, selector] = key.match(delegateEventSplitter);
    return {
      eventName,
      handler: e => {
        if (!selector || hasMatchInAncestry(e.target, selector)) {
          action(e);
        }
      },
    };
  });
};

const actionsSubscription = (...args) => {
  if (!isEqual(args, lastArgs)) {
    lastArgs = args;
    const handlers = createHandlers(...args);
    lastSubscription = () => {
      handlers.forEach(({ eventName, handler }) => root.addEventListener(eventName, handler));
      return () =>
        handlers.forEach(({ eventName, handler }) => root.removeEventListener(eventName, handler));
    };
  }
  return lastSubscription;
};

export const createDecorator = actionsFn => (...args) => storyFn => {
  if (root != null) {
    addons.getChannel().emit(Events.REGISTER_SUBSCRIPTION, actionsSubscription(actionsFn, ...args));
  }
  return storyFn();
};

export default createDecorator(actions);
