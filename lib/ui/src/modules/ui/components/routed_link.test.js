import { shallow } from 'enzyme';
import React from 'react';
import RoutedLink from './routed_link';

const LEFT_BUTTON = 0;
const MIDDLE_BUTTON = 1;
const RIGHT_BUTTON = 2;

describe('manager.ui.components.routed_link', () => {
  describe('render', () => {
    test('should use "a" tag', () => {
      const wrap = shallow(
        <RoutedLink href="href" title="title">
          Content
        </RoutedLink>
      );

      expect(
        wrap.matchesElement(
          <a href="href" title="title">
            Content
          </a>
        )
      ).toBe(true);
    });
  });

  describe('events', () => {
    let e;
    let onClick;
    let wrap;

    beforeEach(() => {
      e = {
        button: LEFT_BUTTON,
        preventDefault: jest.fn(),
      };
      onClick = jest.fn();
      wrap = shallow(<RoutedLink onClick={onClick} />);
    });

    test('should call onClick on a plain left click', () => {
      wrap.simulate('click', e);

      expect(onClick).toHaveBeenCalledWith(e);
      expect(e.preventDefault).toHaveBeenCalled();
    });

    test("shouldn't call onClick on a middle click", () => {
      e.button = MIDDLE_BUTTON;
      wrap.simulate('click', e);

      expect(onClick).not.toHaveBeenCalled();
      expect(e.preventDefault).not.toHaveBeenCalled();
    });

    test("shouldn't call onClick on a right click", () => {
      e.button = RIGHT_BUTTON;
      wrap.simulate('click', e);

      expect(onClick).not.toHaveBeenCalled();
      expect(e.preventDefault).not.toHaveBeenCalled();
    });

    test("shouldn't call onClick on alt+click", () => {
      e.altKey = true;
      wrap.simulate('click', e);

      expect(onClick).not.toHaveBeenCalled();
      expect(e.preventDefault).not.toHaveBeenCalled();
    });

    test("shouldn't call onClick on ctrl+click", () => {
      e.ctrlKey = true;
      wrap.simulate('click', e);

      expect(onClick).not.toHaveBeenCalled();
      expect(e.preventDefault).not.toHaveBeenCalled();
    });

    test("shouldn't call onClick on cmd+click / win+click", () => {
      e.metaKey = true;
      wrap.simulate('click', e);

      expect(onClick).not.toHaveBeenCalled();
      expect(e.preventDefault).not.toHaveBeenCalled();
    });

    test("shouldn't call onClick on shift+click", () => {
      e.shiftKey = true;
      wrap.simulate('click', e);

      expect(onClick).not.toHaveBeenCalled();
      expect(e.preventDefault).not.toHaveBeenCalled();
    });
  });
});
