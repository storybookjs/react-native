// Based on http://backbonejs.org/docs/backbone.html#section-164
import { document, Element } from 'global';
import { useEffect } from '@storybook/client-api';

import { actions } from './actions';

const delegateEventSplitter = /^(\S+)\s*(.*)$/;

const isIE = Element != null && !Element.prototype.matches;
const matchesMethod = isIE ? 'msMatchesSelector' : 'matches';

const root = document && document.getElementById('root');

const hasMatchInAncestry = (element: any, selector: any): boolean => {
  if (element[matchesMethod](selector)) {
    return true;
  }
  const parent = element.parentElement;
  if (!parent) {
    return false;
  }
  return hasMatchInAncestry(parent, selector);
};

const createHandlers = (actionsFn: (...arg: any[]) => object, ...args: any[]) => {
  const actionsObject = actionsFn(...args);
  return Object.entries(actionsObject).map(([key, action]) => {
    const [_, eventName, selector] = key.match(delegateEventSplitter);
    return {
      eventName,
      handler: (e: { target: any }) => {
        if (!selector || hasMatchInAncestry(e.target, selector)) {
          action(e);
        }
      },
    };
  });
};

export const createDecorator = (actionsFn: any) => (...args: any[]) => (storyFn: () => any) => {
  useEffect(() => {
    if (root != null) {
      const handlers = createHandlers(actionsFn, ...args);
      handlers.forEach(({ eventName, handler }) => root.addEventListener(eventName, handler));
      return () =>
        handlers.forEach(({ eventName, handler }) => root.removeEventListener(eventName, handler));
    }
    return undefined;
  }, [root, actionsFn, args]);

  return storyFn();
};

export const withActions = createDecorator(actions);
