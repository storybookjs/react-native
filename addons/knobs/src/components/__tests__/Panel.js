import React from 'react';
import { shallow } from 'enzyme';
import { STORY_CHANGED } from '@storybook/core-events';
import Panel from '../Panel';
import { CHANGE, SET } from '../../shared';

const createTestChannel = () => ({
  on: jest.fn(),
  emit: jest.fn(),
});
const createTestApi = () => ({
  on: jest.fn(),
  emit: jest.fn(),
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
        onStory: jest.fn(),
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
});
