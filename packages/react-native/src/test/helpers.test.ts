import type { RNElement } from './elements';
import { within } from './queries';
import { createUserEvent } from './userEvent';

type FakeElement = RNElement & { dispatchEvent: jest.Mock; children: FakeElement[] };

// A host element as React Native exposes it, with props where `getProps` reads them.
function element(
  tagName: string,
  props: Record<string, unknown> = {},
  children: FakeElement[] = [],
  text = ''
): FakeElement {
  const node = {
    tagName,
    id: typeof props.nativeID === 'string' ? props.nativeID : '',
    children,
    parentElement: null as RNElement | null,
    get textContent(): string {
      return text + children.map((child) => child.textContent).join('');
    },
    dispatchEvent: jest.fn(() => true),
    __internalInstanceHandle: { stateNode: { canonical: { currentProps: props } } },
  };
  children.forEach((child) => (child.parentElement = node));
  return node;
}

const text = (content: string, props: Record<string, unknown> = {}) =>
  element('RN:Paragraph', props, [], content);

function renderForm() {
  const pressable = element('RN:View', { accessibilityRole: 'button', onClick: () => {} }, [
    text('Sign up'),
  ]);
  const root = element('RN:View', {}, [
    text('Create an account', { accessibilityRole: 'header' }),
    text('Email', { nativeID: 'email-label' }),
    element('RN:TextInput', {
      accessibilityLabelledBy: 'email-label',
      placeholder: 'you@example.com',
      value: 'ada@',
      testID: 'email',
    }),
    element('RN:TextInput', { accessibilityLabel: 'Name', defaultValue: 'Ada' }),
    element('RN:Switch', { accessibilityLabel: 'Accept the terms', value: false }),
    pressable,
    text('Enter a valid email', { role: 'alert' }),
  ]);
  return { root, pressable };
}

describe('within', () => {
  it('queries by role and accessible name', () => {
    const canvas = within(renderForm().root);

    expect(canvas.getByRole('button', { name: 'Sign up' }).tagName).toBe('RN:View');
    expect(canvas.getByRole('heading').textContent).toBe('Create an account');
    expect(canvas.getByRole('textbox', { name: 'Email' }).tagName).toBe('RN:TextInput');
    expect(canvas.getByRole('switch', { name: 'Accept the terms', checked: false })).toBeTruthy();
    expect(canvas.queryByRole('switch', { checked: true })).toBeNull();
    expect(canvas.getAllByRole('textbox')).toHaveLength(2);
    expect(canvas.getByRole('alert').textContent).toBe('Enter a valid email');
  });

  it('queries by text, label, placeholder, display value and testID', () => {
    const canvas = within(renderForm().root);

    expect(canvas.getByText('Sign up').textContent).toBe('Sign up');
    expect(canvas.getByText(/valid/).textContent).toBe('Enter a valid email');
    expect(canvas.getByText('create an ACCOUNT', { exact: false })).toBeTruthy();
    expect(canvas.getByLabelText('Email')).toBe(canvas.getByTestId('email'));
    expect(canvas.getByPlaceholderText('you@example.com')).toBe(canvas.getByTestId('email'));
    expect(canvas.getByDisplayValue('Ada')).toBe(canvas.getByLabelText('Name'));
  });

  it('throws like Testing Library when nothing or more than one element matches', () => {
    const canvas = within(renderForm().root);

    expect(() => canvas.getByRole('button', { name: 'Submit' })).toThrow(
      'Unable to find an element with the role "button" and name "Submit"'
    );
    expect(() => canvas.getByRole('textbox')).toThrow(
      'Found multiple elements with the role "textbox"'
    );
    expect(canvas.queryByText('Missing')).toBeNull();
    expect(canvas.queryAllByText('Missing')).toEqual([]);
  });

  it('waits for findBy queries', async () => {
    const { root } = renderForm();
    const canvas = within(root);
    setTimeout(() => {
      const confirmation = text('Signed up Ada');
      confirmation.parentElement = root;
      root.children.push(confirmation);
    }, 100);

    await expect(canvas.findByText(/^Signed up/)).resolves.toBeTruthy();
    await expect(canvas.findByText('Never', undefined, { timeout: 100 })).rejects.toThrow(
      'Unable to find an element with the text: "Never"'
    );
  });
});

describe('userEvent', () => {
  const OriginalEvent = globalThis.Event;

  beforeAll(() => {
    globalThis.Event = class {
      constructor(
        public type: string,
        public init?: object
      ) {}
    } as unknown as typeof Event;
  });

  afterAll(() => {
    globalThis.Event = OriginalEvent;
  });

  const dispatched = (target: FakeElement) =>
    target.dispatchEvent.mock.calls.map(([event]) => ({
      type: event.type,
      nativeEvent: event.nativeEvent,
    }));

  it('types at the end of the value, one character at a time', async () => {
    const canvas = within(renderForm().root);
    const email = canvas.getByLabelText('Email') as FakeElement;

    await createUserEvent().type(email, 'a.b');

    expect(dispatched(email)).toEqual([
      { type: 'change', nativeEvent: { text: 'ada@a', eventCount: 0 } },
      { type: 'change', nativeEvent: { text: 'ada@a.', eventCount: 0 } },
      { type: 'change', nativeEvent: { text: 'ada@a.b', eventCount: 0 } },
    ]);
  });

  it('keeps typing into uncontrolled inputs and clears them', async () => {
    const canvas = within(renderForm().root);
    const name = canvas.getByLabelText('Name') as FakeElement;
    const user = createUserEvent();

    await user.type(name, ' L');
    await user.keyboard('o');
    await user.clear(name);

    expect(dispatched(name).map((event) => event.nativeEvent.text)).toEqual([
      'Ada ',
      'Ada L',
      'Ada Lo',
      '',
    ]);
  });

  it('clicks the pressable that contains the element, and toggles switches', async () => {
    const { root, pressable } = renderForm();
    const canvas = within(root);
    const user = createUserEvent();

    await user.click(canvas.getByText('Sign up'));
    await user.click(canvas.getByRole('switch'));

    expect(dispatched(pressable)).toEqual([{ type: 'click', nativeEvent: {} }]);
    expect(dispatched(canvas.getByRole('switch') as FakeElement)).toEqual([
      { type: 'change', nativeEvent: { value: true } },
    ]);
  });

  it('explains when elements cannot dispatch events', async () => {
    const button = element('RN:View', { onClick: () => {} });
    delete (button as Partial<FakeElement>).dispatchEvent;

    await expect(createUserEvent().click(button)).rejects.toThrow('has no dispatchEvent');
  });
});
