import handleKeyEvents from '../handle_keyevents';
import { expect } from 'chai';
import sinon from 'sinon';
import keycode from 'keycode';

describe('manager.ui.config.handle_keyevents', () => {
  it('should call the correct action', () => {
    const actions = {
      shortcuts: {
        handleEvent: sinon.mock()
      }
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
        }
      }
    };

    window.onkeydown(e);

    window.onkeydown = originalOnkeydown;
    expect(actions.shortcuts.handleEvent.callCount).to.be.equal(1);
  });

  it('should not call any actions if the event target is an input', () => {
    const actions = {
      shortcuts: {
        handleEvent: sinon.mock()
      }
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
        }
      }
    };

    window.onkeydown(e);

    window.onkeydown = originalOnkeydown;
    expect(actions.shortcuts.handleEvent.callCount).to.be.equal(0);
  });

  it('should not call any actions if the event target has contenteditable enabled', () => {
    const actions = {
      shortcuts: {
        handleEvent: sinon.mock()
      }
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
        }
      }
    };

    window.onkeydown(e);

    window.onkeydown = originalOnkeydown;
    expect(actions.shortcuts.handleEvent.callCount).to.be.equal(0);
  });
});
