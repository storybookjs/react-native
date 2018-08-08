import { shallow } from 'enzyme';
import React from 'react';
import MenuItem from './menu_item';

const keyCodeEnter = 13;

describe('manager.ui.components.menu_item', () => {
  describe('render', () => {
    test('should use "a" tag', () => {
      const wrap = shallow(
        <MenuItem title="title" onClick={() => undefined}>
          Content
        </MenuItem>
      );

      expect(
        wrap.matchesElement(
          <div role="menuitem" tabIndex="0" title="title">
            Content
          </div>
        )
      ).toBe(true);
    });
  });

  describe('events', () => {
    let onClick;
    let wrap;

    beforeEach(() => {
      onClick = jest.fn();
      wrap = shallow(<MenuItem onClick={onClick}>Content</MenuItem>);
    });

    test('should call onClick on a click', () => {
      wrap.simulate('click');

      expect(onClick).toHaveBeenCalled();
    });

    test('should call onClick on enter key', () => {
      const e = { keyCode: keyCodeEnter };
      wrap.simulate('keyDown', e);

      expect(onClick).toHaveBeenCalledWith(e);
    });

    test("shouldn't call onClick on other keys", () => {
      wrap.simulate('keyDown', {});

      expect(onClick).not.toHaveBeenCalled();
    });

    test('should prevent default on mousedown', () => {
      const e = {
        preventDefault: jest.fn(),
      };
      wrap.simulate('mouseDown', e);

      expect(e.preventDefault).toHaveBeenCalled();
    });
  });
});
