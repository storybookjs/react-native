import React from 'react';
import { shallow, mount } from 'enzyme';
import { STORY_CHANGED } from '@storybook/core-events';
import { TabsState } from '@storybook/components';

import { ThemeProvider, themes, convert } from '@storybook/theming';
import Panel from '../Panel';
import { CHANGE, SET } from '../../shared';
import PropForm from '../PropForm';

const createTestChannel = () => ({
  on: jest.fn(),
  emit: jest.fn(),
});
const createTestApi = () => ({
  on: jest.fn(),
  emit: jest.fn(),
});

// React.memo in Tabs is causing problems with enzyme, probably
// due to https://github.com/airbnb/enzyme/issues/1875, so this
// is a workaround
jest.mock('react', () => {
  const r = jest.requireActual('react');
  return { ...r, memo: x => x };
});

describe('Panel', () => {
  it('should subscribe to setKnobs event of channel', () => {
    const testChannel = createTestChannel();
    const testApi = createTestApi();
    shallow(<Panel channel={testChannel} api={testApi} active />);
    expect(testChannel.on).toHaveBeenCalledWith(SET, expect.any(Function));
  });

  it('should subscribe to STORY_CHANGE event', () => {
    const testChannel = createTestChannel();
    const testApi = createTestApi();
    shallow(<Panel channel={testChannel} api={testApi} active />);

    expect(testApi.on.mock.calls).toContainEqual([STORY_CHANGED, expect.any(Function)]);
    expect(testChannel.on).toHaveBeenCalledWith(SET, expect.any(Function));
  });

  describe('setKnobs handler', () => {
    it('should read url params and set values for existing knobs', () => {
      const handlers = {};

      const testChannel = {
        on: (e, handler) => {
          handlers[e] = handler;
        },
        emit: jest.fn(),
      };

      const testQueryParams = {
        'knob-foo': 'test string',
        bar: 'some other string',
      };

      const testApi = {
        on: (e, handler) => {
          handlers[e] = handler;
        },
        getQueryParam: key => testQueryParams[key],
        setQueryParams: jest.fn(),
      };

      shallow(<Panel channel={testChannel} api={testApi} active />);
      const setKnobsHandler = handlers[SET];

      const knobs = {
        foo: {
          name: 'foo',
          value: 'default string',
          type: 'text',
        },
        baz: {
          name: 'baz',
          value: 'another knob value',
          type: 'text',
        },
      };

      setKnobsHandler({ knobs, timestamp: +new Date() });
      const knobFromUrl = {
        name: 'foo',
        value: testQueryParams['knob-foo'],
        type: 'text',
      };
      const e = CHANGE;
      expect(testChannel.emit).toHaveBeenCalledWith(e, knobFromUrl);
    });

    it('should remove query params when url params are already read', () => {
      const handlers = {};

      const testChannel = {
        on: (e, handler) => {
          handlers[e] = handler;
        },
        emit: jest.fn(),
      };

      const testQueryParams = {
        'knob-foo': 'test string',
        bar: 'some other string',
      };

      const testApi = {
        on: (e, handler) => {
          handlers[e] = handler;
        },
        getQueryParam: key => testQueryParams[key],
        setQueryParams: jest.fn(),
      };

      const wrapper = shallow(<Panel channel={testChannel} api={testApi} active />);
      const setKnobsHandler = handlers[SET];

      const knobs = {
        foo: {
          name: 'foo',
          value: 'default string',
          type: 'text',
        },
        baz: {
          name: 'baz',
          value: 'another knob value',
          type: 'text',
        },
      };

      // Make it act like that url params are already checked
      wrapper.instance().loadedFromUrl = true;

      setKnobsHandler({ knobs, timestamp: +new Date() });
      const knobFromStory = {
        'knob-foo': null,
        'knob-baz': null,
      };

      expect(testApi.setQueryParams).toHaveBeenCalledWith(knobFromStory);
    });
  });

  describe('handleChange()', () => {
    it('should set queryParams and emit knobChange event', () => {
      const testChannel = {
        on: jest.fn(),
        emit: jest.fn(),
      };

      const testApi = {
        getQueryParam: jest.fn(),
        setQueryParams: jest.fn(),
        on: jest.fn(),
      };

      const wrapper = shallow(<Panel channel={testChannel} api={testApi} active />);

      const testChangedKnob = {
        name: 'foo',
        value: 'changed text',
        type: 'text',
      };
      wrapper.instance().handleChange(testChangedKnob);
      expect(testChannel.emit).toHaveBeenCalledWith(CHANGE, testChangedKnob);

      // const paramsChange = { 'knob-foo': 'changed text' };
      // expect(testApi.setQueryParams).toHaveBeenCalledWith(paramsChange);
    });
  });

  describe('groups', () => {
    const testChannel = {
      on: jest.fn(),
      emit: jest.fn(),
      removeListener: jest.fn(),
    };
    const testApi = {
      getQueryParam: jest.fn(),
      setQueryParams: jest.fn(),
      on: jest.fn(() => () => {}),
    };

    it('should have no tabs when there are no groupIds', () => {
      // Unfortunately, a shallow render will not invoke the render() function of the groups --
      // it thinks they are unnamed function components (what they effectively are anyway).
      //
      // We have to do a full mount.

      const root = mount(
        <ThemeProvider theme={convert(themes.light)}>
          <Panel channel={testChannel} api={testApi} active />
        </ThemeProvider>
      );

      testChannel.on.mock.calls[0][1]({
        knobs: {
          foo: {
            name: 'foo',
            defaultValue: 'test',
            used: true,
            // no groupId
          },
          bar: {
            name: 'bar',
            defaultValue: 'test2',
            used: true,
            // no groupId
          },
        },
      });

      const wrapper = root.update().find(Panel);

      const formWrapper = wrapper.find(PropForm);
      const knobs = formWrapper.map(formInstanceWrapper => formInstanceWrapper.prop('knobs'));

      expect(knobs).toMatchSnapshot();

      root.unmount();
    });

    it('should have one tab per groupId and an empty Other tab when all are defined', () => {
      const root = mount(
        <ThemeProvider theme={convert(themes.light)}>
          <Panel channel={testChannel} api={testApi} active />
        </ThemeProvider>
      );

      testChannel.on.mock.calls[0][1]({
        knobs: {
          foo: {
            name: 'foo',
            defaultValue: 'test',
            used: true,
            groupId: 'foo',
          },
          bar: {
            name: 'bar',
            defaultValue: 'test2',
            used: true,
            groupId: 'bar',
          },
        },
      });

      const wrapper = root.update().find(Panel);

      const titles = wrapper
        .find(TabsState)
        .find('button')
        .map(child => child.prop('children'));
      expect(titles).toEqual(['foo', 'bar']);

      const knobs = wrapper.find(PropForm);
      // but it should not have its own PropForm in this case
      expect(knobs.length).toEqual(titles.length);
      expect(knobs).toMatchSnapshot();

      root.unmount();
    });

    it('the Other tab should have its own additional content when there are knobs both with and without a groupId', () => {
      const root = mount(
        <ThemeProvider theme={convert(themes.light)}>
          <Panel channel={testChannel} api={testApi} active />
        </ThemeProvider>
      );

      testChannel.on.mock.calls[0][1]({
        knobs: {
          foo: {
            name: 'foo',
            defaultValue: 'test',
            used: true,
            groupId: 'foo',
          },
          bar: {
            name: 'bar',
            defaultValue: 'test2',
            used: true,
            // no groupId
          },
        },
      });

      const wrapper = root.update().find(Panel);

      const titles = wrapper
        .find(TabsState)
        .find('button')
        .map(child => child.prop('children'));
      expect(titles).toEqual(['foo', 'Other']);

      const knobs = wrapper.find(PropForm).map(propForm => propForm.prop('knobs'));
      // there are props with no groupId so Other should also have its own PropForm
      expect(knobs.length).toEqual(titles.length);
      expect(knobs).toMatchSnapshot();

      root.unmount();
    });
  });
});
