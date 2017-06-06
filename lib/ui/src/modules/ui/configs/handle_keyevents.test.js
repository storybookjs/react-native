import { window } from 'global';
import keycode from 'keycode';
import handleKeyEvents from './handle_keyevents';

describe('manager.ui.config.handle_keyevents', () => {
  test('should call the correct action', () => {
    const actions = {
      shortcuts: {
        handleEvent: jest.fn(),
      },
    };
    const originalOnkeydown = window.onkeydown;
    handleKeyEvents(actions);

    const e = {
      ctrlKey: true,
      shiftKey: true,
      keyCode: keycode('F'),
      preventDefault() {},
      target: {
        tagName: 'DIV',
        getAttribute() {
          return null;
        },
      },
    };
    window.onkeydown(e);

    expect(actions.shortcuts.handleEvent).toHaveBeenCalled();

    window.onkeydown = originalOnkeydown;
  });

  test('should not call any actions if the event target is an input', () => {
    const actions = {
      shortcuts: {
        handleEvent: jest.fn(),
      },
    };
    const originalOnkeydown = window.onkeydown;
    handleKeyEvents(actions);

    const e = {
      ctrlKey: true,
      shiftKey: true,
      keyCode: keycode('F'),
      preventDefault() {},
      target: {
        tagName: 'INPUT',
        getAttribute() {
          return null;
        },
      },
    };
    window.onkeydown(e);

    expect(actions.shortcuts.handleEvent).not.toHaveBeenCalled();

    window.onkeydown = originalOnkeydown;
  });

  test('should not call any actions if the event target has contenteditable enabled', () => {
    const actions = {
      shortcuts: {
        handleEvent: jest.fn(),
      },
    };

    const originalOnkeydown = window.onkeydown;
    handleKeyEvents(actions);

    const e = {
      ctrlKey: true,
      shiftKey: true,
      keyCode: keycode('F'),
      preventDefault() {},
      target: {
        tagName: 'DIV',
        getAttribute(attr) {
          return /contenteditable/i.test(attr) ? '' : null;
        },
      },
    };

    window.onkeydown(e);

    expect(actions.shortcuts.handleEvent).not.toHaveBeenCalled();

    window.onkeydown = originalOnkeydown;
  });
});
