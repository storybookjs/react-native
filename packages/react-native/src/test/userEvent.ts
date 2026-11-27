/**
 * User interactions built on `dispatchEvent`, named and called like Testing Library's `userEvent`.
 * Each method dispatches the event native would, so the component's ordinary `onChangeText`,
 * `onValueChange` and `onPress` props run.
 *
 * Needs a React Native version with `EventTarget` support on elements, currently the Canary
 * release channel.
 */
import { describeElement, getProps, type RNElement } from './elements';

export type UserEventOptions = {
  /** Milliseconds to wait between typed characters. Defaults to 0. */
  delay?: number;
};

export type TypeOptions = UserEventOptions & {
  /** Type without clicking the element first. */
  skipClick?: boolean;
};

type EventConstructor = new (type: string, init?: { bubbles?: boolean }) => object;

function createEvent(type: string, nativeEvent: Record<string, unknown> = {}) {
  const Event = (globalThis as { Event?: EventConstructor }).Event;
  if (!Event) {
    throw new Error(
      'userEvent needs the global Event, from a React Native version with EventTarget'
    );
  }
  return Object.assign(new Event(type, { bubbles: true }), { nativeEvent });
}

function dispatch(element: RNElement, event: object) {
  if (typeof element.dispatchEvent !== 'function') {
    throw new Error(
      `${describeElement(element)} has no dispatchEvent. userEvent needs a React Native version with EventTarget support on elements, currently the Canary release channel.`
    );
  }
  element.dispatchEvent(event);
}

const wait = (ms: number) =>
  ms > 0 ? new Promise((resolve) => setTimeout(resolve, ms)) : Promise.resolve();

function isDisabled(element: RNElement) {
  const props = getProps(element);
  const state = (props.accessibilityState ?? {}) as Record<string, unknown>;
  return Boolean(props.disabled ?? props['aria-disabled'] ?? state.disabled);
}

// Pressability only turns a `click` into `onPress` on the element it was dispatched on, so a click
// on the text inside a button goes to the button, as it would on the web.
function getPressTarget(element: RNElement) {
  for (let current: RNElement | null = element; current; current = current.parentElement) {
    if (typeof getProps(current).onClick === 'function') return current;
  }
  return element;
}

export function createUserEvent({ delay: defaultDelay = 0 }: UserEventOptions = {}) {
  // Typed text for inputs without a `value` prop, which don't expose what's in them.
  const uncontrolledValues = new WeakMap<RNElement, string>();
  let activeElement: RNElement | null = null;

  const getValue = (element: RNElement) => {
    const props = getProps(element);
    if (typeof props.value === 'string') return props.value;
    return uncontrolledValues.get(element) ?? (props.defaultValue as string | undefined) ?? '';
  };

  // `eventCount: 0` matches an input that native hasn't edited yet, so native accepts the value.
  const setValue = (element: RNElement, text: string) => {
    uncontrolledValues.set(element, text);
    dispatch(element, createEvent('change', { text, eventCount: 0 }));
  };

  const user = {
    /** Presses the element: `onPress` for pressables, or toggles a switch. */
    async click(element: RNElement) {
      if (element.tagName === 'RN:TextInput') {
        activeElement = element;
        return;
      }
      if (element.tagName === 'RN:Switch') {
        if (isDisabled(element)) return;
        dispatch(element, createEvent('change', { value: !getProps(element).value }));
        return;
      }
      dispatch(getPressTarget(element), createEvent('click'));
    },

    async dblClick(element: RNElement) {
      await user.click(element);
      await user.click(element);
    },

    /** Types `text` at the end of the input's value, one character at a time. */
    async type(
      element: RNElement,
      text: string,
      { delay = defaultDelay, skipClick }: TypeOptions = {}
    ) {
      if (!skipClick) await user.click(element);
      activeElement = element;
      if (getProps(element).editable === false) return;
      const start = getValue(element);
      for (let i = 1; i <= text.length; i += 1) {
        setValue(element, start + text.slice(0, i));
        await wait(delay);
      }
    },

    /** Types into the element last clicked or typed into. */
    async keyboard(text: string, { delay = defaultDelay }: UserEventOptions = {}) {
      if (!activeElement) {
        throw new Error(
          'userEvent.keyboard needs an input to type into. Click or type into one first.'
        );
      }
      await user.type(activeElement, text, { delay, skipClick: true });
    },

    async clear(element: RNElement) {
      activeElement = element;
      if (getProps(element).editable === false) return;
      setValue(element, '');
    },
  };

  return user;
}

export type UserEventObject = ReturnType<typeof createUserEvent>;

export const userEvent = {
  ...createUserEvent(),
  /** Creates an instance with its own options, like `userEvent.setup()` on the web. */
  setup: (options?: UserEventOptions) => createUserEvent(options),
};
