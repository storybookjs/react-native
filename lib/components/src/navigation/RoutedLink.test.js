import { shallow } from 'enzyme';
import React from 'react';
import RoutedLink from './RoutedLink';

const LEFT_BUTTON = 0;
const MIDDLE_BUTTON = 1;
const RIGHT_BUTTON = 2;

const createEvent = options => ({
  button: LEFT_BUTTON,
  preventDefault: jest.fn(),
  ...options,
});
const render = props => shallow(<RoutedLink {...{ children: 'Content', ...props }} />);

const setup = ({ props, event }) => ({
  e: createEvent(event),
  result: render(props),
  onClick: props.onClick || jest.fn(),
});

describe('manager.ui.components.routed_link', () => {
  describe('render', () => {
    test('should render with onClick when provided', () => {
      const { result } = setup({ props: { onClick: jest.fn() } });

      expect(result).toMatchSnapshot();
    });

    test('should not render onClick when not provided', () => {
      const { result } = setup({
        props: {
          href: 'href',
          children: 'Content',
        },
      });

      expect(result).toMatchSnapshot();
    });

    test('should render other properties', () => {
      const { result } = setup({
        props: {
          href: 'href',
          title: 'title',
          target: '_blank',
          children: 'Other content',
        },
      });

      expect(result).toMatchSnapshot();
    });
  });

  describe('events', () => {
    test('should call onClick on a plain left click', () => {
      const { result, onClick, e } = setup({
        props: { onClick: jest.fn() },
        event: { button: LEFT_BUTTON },
      });

      result.simulate('click', e);

      expect(onClick).toHaveBeenCalledWith(e);
      expect(e.preventDefault).toHaveBeenCalled();
    });

    test("shouldn't call onClick on a middle click", () => {
      const { result, onClick, e } = setup({
        props: { onClick: jest.fn() },
        event: { button: MIDDLE_BUTTON },
      });

      result.simulate('click', e);

      expect(onClick).not.toHaveBeenCalled();
      expect(e.preventDefault).not.toHaveBeenCalled();
    });

    test("shouldn't call onClick on a right click", () => {
      const { result, onClick, e } = setup({
        props: { onClick: jest.fn() },
        event: { button: RIGHT_BUTTON },
      });

      result.simulate('click', e);

      expect(onClick).not.toHaveBeenCalled();
      expect(e.preventDefault).not.toHaveBeenCalled();
    });

    test("shouldn't call onClick on alt+click", () => {
      const { result, onClick, e } = setup({
        props: { onClick: jest.fn() },
        event: { altKey: true },
      });

      result.simulate('click', e);

      expect(onClick).not.toHaveBeenCalled();
      expect(e.preventDefault).not.toHaveBeenCalled();
    });

    test("shouldn't call onClick on ctrl+click", () => {
      const { result, onClick, e } = setup({
        props: { onClick: jest.fn() },
        event: { ctrlKey: true },
      });

      result.simulate('click', e);

      expect(onClick).not.toHaveBeenCalled();
      expect(e.preventDefault).not.toHaveBeenCalled();
    });

    test("shouldn't call onClick on cmd+click / win+click", () => {
      const { result, onClick, e } = setup({
        props: { onClick: jest.fn() },
        event: { metaKey: true },
      });

      result.simulate('click', e);

      expect(onClick).not.toHaveBeenCalled();
      expect(e.preventDefault).not.toHaveBeenCalled();
    });

    test("shouldn't call onClick on shift+click", () => {
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
