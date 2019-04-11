import { shallow } from 'enzyme';
import React from 'react';
import Link from './link';

const LEFT_BUTTON = 0;
const MIDDLE_BUTTON = 1;
const RIGHT_BUTTON = 2;

const createEvent = (options: any) => ({
  button: LEFT_BUTTON,
  preventDefault: jest.fn(),
  ...options,
});
const renderLink = (props: any) => shallow(<Link {...{ children: 'Content', ...props }} />);

const setup = ({ props, event }: any) => ({
  e: createEvent(event),
  result: renderLink(props),
  onClick: props.onClick || jest.fn(),
});

describe('Link', () => {
  describe('events', () => {
    it('should call onClick on a plain left click', () => {
      const { result, onClick, e } = setup({
        props: { onClick: jest.fn() },
        event: { button: LEFT_BUTTON },
      });

      result.simulate('click', e);

      expect(onClick).toHaveBeenCalledWith(e);
      expect(e.preventDefault).toHaveBeenCalled();
    });

    it("shouldn't call onClick on a middle click", () => {
      const { result, onClick, e } = setup({
        props: { onClick: jest.fn() },
        event: { button: MIDDLE_BUTTON },
      });

      result.simulate('click', e);

      expect(onClick).not.toHaveBeenCalled();
      expect(e.preventDefault).not.toHaveBeenCalled();
    });

    it("shouldn't call onClick on a right click", () => {
      const { result, onClick, e } = setup({
        props: { onClick: jest.fn() },
        event: { button: RIGHT_BUTTON },
      });

      result.simulate('click', e);

      expect(onClick).not.toHaveBeenCalled();
      expect(e.preventDefault).not.toHaveBeenCalled();
    });

    it("shouldn't call onClick on alt+click", () => {
      const { result, onClick, e } = setup({
        props: { onClick: jest.fn() },
        event: { altKey: true },
      });

      result.simulate('click', e);

      expect(onClick).not.toHaveBeenCalled();
      expect(e.preventDefault).not.toHaveBeenCalled();
    });

    it("shouldn't call onClick on ctrl+click", () => {
      const { result, onClick, e } = setup({
        props: { onClick: jest.fn() },
        event: { ctrlKey: true },
      });

      result.simulate('click', e);

      expect(onClick).not.toHaveBeenCalled();
      expect(e.preventDefault).not.toHaveBeenCalled();
    });

    it("shouldn't call onClick on cmd+click / win+click", () => {
      const { result, onClick, e } = setup({
        props: { onClick: jest.fn() },
        event: { metaKey: true },
      });

      result.simulate('click', e);

      expect(onClick).not.toHaveBeenCalled();
      expect(e.preventDefault).not.toHaveBeenCalled();
    });

    it("shouldn't call onClick on shift+click", () => {
      const { result, onClick, e } = setup({
        props: { onClick: jest.fn() },
        event: { shiftKey: true },
      });

      result.simulate('click', e);

      expect(onClick).not.toHaveBeenCalled();
      expect(e.preventDefault).not.toHaveBeenCalled();
    });
  });
});
