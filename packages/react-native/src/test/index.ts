/**
 * `@storybook/react-native/test`: the React Native counterpart of `storybook/test`.
 *
 * `within`, `userEvent` and `waitFor` work on React Native elements and are instrumented like
 * their web versions, so their calls show up in the Interactions panel. The rest is re-exported
 * from `storybook/test`.
 *
 * Experimental: queries read props through React Native internals, and `userEvent` needs
 * `EventTarget` support on elements, currently in React Native's Canary release channel.
 */
import { instrument } from 'storybook/internal/instrumenter';
import { within as _within } from './queries';
import { createUserEvent, userEvent as _userEvent } from './userEvent';
import { waitFor as _waitFor } from './waitFor';
import { isRNElement, type RNElement } from './elements';

const intercept = (method: string, path: Array<string | object>) =>
  path[0] === 'userEvent' || method.startsWith('find') || method.startsWith('waitFor');

// The instrumenter also instruments what instrumented calls return, walking their keys. It skips
// DOM elements, but React Native elements look like plain objects to it, and walking their React
// fiber overflows the stack. Return them as they are.
const getKeys = (obj: object) => (isRNElement(obj) ? [] : Object.keys(obj));

export const { within, userEvent, waitFor } = instrument(
  { within: _within, userEvent: _userEvent, waitFor: _waitFor },
  { intercept, getKeys }
);

/**
 * `canvas` for the story context: queries scoped to the story, instrumented so they show up in the
 * Interactions panel as `canvas.getByRole(…)`.
 */
export function createInstrumentedCanvas(root: RNElement) {
  return instrument(
    { canvas: _within(root) },
    { intercept: (method: string) => method.startsWith('find'), getKeys }
  ).canvas;
}

/** `userEvent` for the story context, like the web's instrumented `userEvent.setup()`. */
export function createInstrumentedUserEvent() {
  return instrument({ userEvent: createUserEvent() }, { intercept: true, getKeys }).userEvent;
}

export {
  clearAllMocks,
  expect,
  fn,
  isMockFunction,
  mocked,
  onMockCall,
  resetAllMocks,
  restoreAllMocks,
  sb,
  spyOn,
} from 'storybook/test';

export type { Canvas, ByRoleOptions, Matcher, MatcherOptions } from './queries';
export type { TypeOptions, UserEventObject, UserEventOptions } from './userEvent';
export type { WaitForOptions } from './waitFor';
export { getAccessibleName, getRole } from './queries';
export type { RNElement };
