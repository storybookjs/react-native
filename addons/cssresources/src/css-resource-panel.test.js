import React from 'react';
import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { SyntaxHighlighter } from '@storybook/components';
import { STORY_RENDERED } from '@storybook/core-events';
import { EVENTS, PARAM_KEY } from './constants';
import { CssResourcePanel } from './css-resource-panel.tsx';

configure({
  adapter: new Adapter(),
});

const defaultParameters = [
  {
    id: 'fake-css-id-1',
    code: 'fake-css-code-1',
    picked: true,
  },
  {
    id: 'fake-css-id-2',
    code: 'fake-css-code-2',
    picked: false,
  },
];
const newFakeParameters = [
  {
    id: 'new-fake-css-id-1',
    code: 'new-fake-css-code-1',
    picked: false,
  },
  {
    id: 'new-fake-css-id-2',
    code: 'new-fake-css-code-2',
    picked: true,
  },
];
const defaultProps = {
  active: true,
  api: {
    emit: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
    getParameters: jest.fn(() => defaultParameters),
  },
};

const shallowNode = (props = defaultProps) => shallow(<CssResourcePanel {...props} />);
const mountNode = (props = defaultProps) => mount(<CssResourcePanel {...props} />);

describe('CSSResourcePanel', () => {
  describe('constructor', () => {
    const node = mountNode();

    it('should initialize state', () => {
      expect(node).toHaveState({ list: [], currentStoryId: '' });
    });

    it('should render an empty div', () => {
      expect(node.html()).toEqual('<div></div>');
    });
  });

  describe('componentDidMount', () => {
    let spy;

    afterEach(() => {
      spy.mockClear();
    });

    it('should execute when component is mounted', () => {
      spy = jest.spyOn(CssResourcePanel.prototype, 'componentDidMount');
      shallowNode();
      expect(spy).toHaveBeenCalled();
    });

    it('should add STORY_RENDERED listener to the api', () => {
      const apiAdd = jest.fn();
      const node = shallowNode({
        ...defaultProps,
        api: {
          ...defaultProps.api,
          on: apiAdd,
        },
      });
      const { onStoryChange } = node.instance();
      expect(apiAdd).toHaveBeenCalledWith(STORY_RENDERED, onStoryChange);
    });
  });

  describe('componentWillUnmount', () => {
    let spy;

    afterEach(() => {
      if (spy) {
        spy.mockClear();
      }
    });

    it('should execute when component is unmounted', () => {
      spy = jest.spyOn(CssResourcePanel.prototype, 'componentWillUnmount');
      shallowNode().unmount();
      expect(spy).toHaveBeenCalled();
    });

    it('should remove STORY_RENDERED listener from the api', () => {
      const apiRemove = jest.fn();
      const node = shallowNode({
        ...defaultProps,
        api: {
          ...defaultProps.api,
          off: apiRemove,
        },
      });
      const { onStoryChange } = node.instance();
      node.unmount();
      expect(apiRemove).toHaveBeenCalledWith(STORY_RENDERED, onStoryChange);
    });
  });

  describe('onStoryChange', () => {
    it('should populate list with the default items', () => {
      const node = shallowNode();
      expect(node.state('list')).toMatchObject([]);
      node.instance().onStoryChange('fake-story-id');
      expect(node.state('list')).toMatchObject(defaultParameters);
    });

    it('should pull default items from getParameters', () => {
      const apiGetParameters = jest.fn(() => newFakeParameters);
      const node = shallowNode({
        ...defaultProps,
        api: {
          ...defaultProps.api,
          getParameters: apiGetParameters,
        },
      });
      expect(node.state('list')).toMatchObject([]);
      node.instance().onStoryChange('fake-story-id');
      expect(apiGetParameters).toHaveBeenCalledWith('fake-story-id', PARAM_KEY);
      expect(node.state('list')).toMatchObject(newFakeParameters);
    });

    it('should maintain picked attribute for matching ids', () => {
      const node = shallowNode();
      const invertedItem = {
        ...defaultParameters[0],
        picked: !defaultParameters[0].picked,
      };
      node.setState({ list: [invertedItem] });
      node.instance().onStoryChange('fake-story-id');
      expect(node.state('list')).toMatchObject([
        {
          ...defaultParameters[0],
          picked: !defaultParameters[0].picked,
        },
        ...defaultParameters.slice(1),
      ]);
    });

    it("should not overwrite list when story id hasn't changed", () => {
      const fakeList = [];
      const apiGetParameters = jest.fn(() => newFakeParameters);
      const node = shallowNode({
        ...defaultProps,
        api: {
          ...defaultProps.api,
          getParameters: apiGetParameters,
        },
      });
      node.setState({ list: fakeList, currentStoryId: 'fake-story-id' });
      expect(node.state('list')).toEqual(fakeList);
      node.instance().onStoryChange('fake-story-id');
      expect(node.state('list')).toEqual(fakeList);
    });

    it('should not overwrite list when default list is undefined', () => {
      const fakeList = [];
      const apiGetParameters = jest.fn(() => undefined);
      const node = shallowNode({
        ...defaultProps,
        api: {
          ...defaultProps.api,
          getParameters: apiGetParameters,
        },
      });
      node.setState({ list: fakeList });
      expect(node.state('list')).toEqual(fakeList);
      node.instance().onStoryChange('fake-story-id');
      expect(node.state('list')).toEqual(fakeList);
    });
  });

  describe('onChange', () => {
    let spy;

    afterEach(() => {
      if (spy) {
        spy.mockClear();
      }
    });

    const changedIndex = 1;
    const fakeEvent = {
      target: {
        id: defaultParameters[changedIndex].id,
        checked: true,
      },
    };
    const newFakeList = defaultParameters.map((param, index) =>
      index === changedIndex
        ? {
            ...param,
            picked: true,
          }
        : param
    );

    it('should update the list with new picked items', () => {
      const node = shallowNode();
      node.instance().onStoryChange('fake-story-id');
      node.instance().onChange(fakeEvent);
      expect(node.state('list')).toMatchObject(newFakeList);
    });

    it('should call emit method with updated list', () => {
      spy = jest.spyOn(CssResourcePanel.prototype, 'emit');
      const node = shallowNode();
      node.instance().onStoryChange('fake-story-id');
      node.instance().onChange(fakeEvent);
      expect(spy).toHaveBeenCalledWith(newFakeList);
    });
  });

  describe('emit', () => {
    it('should call emit from the api with EVENTS.SET', () => {
      const apiEmit = jest.fn();
      const node = shallowNode({
        ...defaultProps,
        api: {
          ...defaultProps.api,
          emit: apiEmit,
        },
      });
      node.instance().emit(newFakeParameters);
      expect(apiEmit).toHaveBeenCalledWith(EVENTS.SET, newFakeParameters);
    });
  });

  describe('render', () => {
    it('should not render anything when not active', () => {
      const node = shallowNode({
        ...defaultProps,
        active: false,
      });
      node.instance().onStoryChange('fake-story-id');
      expect(node).toBeEmptyRender();
    });

    describe('each list item', () => {
      const node = shallowNode();
      node.instance().onStoryChange('fake-story-id');

      defaultParameters.forEach(param => {
        it(`should render list item with id '${param.id}'`, () => {
          expect(node.find(`#${param.id}`).length).toEqual(1);
        });

        it(`should render list item with id '${param.id}' as ${
          param.picked ? 'checked' : 'unchecked'
        }`, () => {
          expect(
            node
              .find(`#${param.id}`)
              .first()
              .prop('checked')
          ).toBe(param.picked);
        });
      });
    });

    it('should not render code for items without a code', () => {
      const apiGetParameters = jest.fn(() => [
        {
          id: 'local-fake-id-1',
          picked: true,
        },
        {
          id: 'local-fake-id-2',
          code: 'local-fake-code-2',
          picked: false,
        },
      ]);
      const node = shallowNode({
        ...defaultProps,
        api: {
          ...defaultProps.api,
          getParameters: apiGetParameters,
        },
      });
      node.instance().onStoryChange('fake-story-id');
      expect(node.find(SyntaxHighlighter).length).toEqual(1);
    });
  });
});
