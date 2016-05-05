import handleKeyEvents from '../handle_keyevents';
import { expect } from 'chai';
const { describe, it } = global;
import sinon from 'sinon';
import keycode from 'keycode';

describe('manager.ui.config.handle_keyevents', () => {
  it('should call the correct action', () => {
    const actions = {
      shortcuts: {
        handleEvent: sinon.mock(),
      },
    };

    const originalOnkeydown = window.onkeydown;
    handleKeyEvents(actions);

    const e = {
      ctrlKey: true,
      shiftKey: true,
      keyCode: keycode('F'),
      preventDefault() {},
    };

    window.onkeydown(e);

    window.onkeydown = originalOnkeydown;
    expect(actions.shortcuts.handleEvent.callCount).to.be.equal(1);
  });
});
