import React from 'react';
import { shallow, mount } from 'enzyme';
import { TabsState } from '@storybook/components';
import Panel from '../Panel';
import PropForm from '../PropForm';

describe('Panel', () => {
  it('should subscribe to setKnobs event of channel', () => {
    const testChannel = { on: jest.fn() };
    const testApi = { onStory: jest.fn() };
    shallow(<Panel channel={testChannel} api={testApi} active />);
    expect(testChannel.on).toHaveBeenCalledWith('addon:knobs:setKnobs', expect.any(Function));
  });

  it('should subscribe to onStory event', () => {
    const testChannel = { on: jest.fn() };
    const testApi = { onStory: jest.fn() };
    shallow(<Panel channel={testChannel} api={testApi} active />);

    expect(testApi.onStory).toHaveBeenCalled();
    expect(testChannel.on).toHaveBeenCalledWith('addon:knobs:setKnobs', expect.any(Function));
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
        getQueryParam: key => testQueryParams[key],
        setQueryParams: jest.fn(),
        onStory: jest.fn(),
      };

      shallow(<Panel channel={testChannel} api={testApi} active />);
      const setKnobsHandler = handlers['addon:knobs:setKnobs'];

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
      const e = 'addon:knobs:knobChange';
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
        getQueryParam: key => testQueryParams[key],
        setQueryParams: jest.fn(),
        onStory: jest.fn(),
      };

      const wrapper = shallow(<Panel channel={testChannel} api={testApi} active />);
      const setKnobsHandler = handlers['addon:knobs:setKnobs'];

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
        onStory: jest.fn(),
      };

      const wrapper = shallow(<Panel channel={testChannel} api={testApi} active />);

      const testChangedKnob = {
        name: 'foo',
        value: 'changed text',
        type: 'text',
      };
      wrapper.instance().handleChange(testChangedKnob);
      expect(testChannel.emit).toHaveBeenCalledWith('addon:knobs:knobChange', testChangedKnob);

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
      onStory: jest.fn(() => () => {}),
    };

    it('should have no tabs when there are no groupIds', () => {
      // Unfortunately, a shallow render will not invoke the render() function of the groups --
      // it thinks they are unnamed function components (what they effectively are anyway).
      //
      // We have to do a full mount.

      const wrapper = mount(<Panel channel={testChannel} api={testApi} active />);
      try {
        wrapper.setState({
          knobs: {
            foo: {
              name: 'foo',
              defaultValue: 'test',
              used: true,
              // no groupId
            },
          },
        });

        expect(wrapper.find(TabsState).exists()).toBeFalsy();

        const formWrapper = wrapper.find(PropForm);
        const knobs = formWrapper.map(formInstanceWrapper => formInstanceWrapper.prop('knobs'));
        expect(knobs).toMatchSnapshot();
      } finally {
        wrapper.unmount();
      }
    });

    it('should have one tab per groupId and an empty ALL tab when all are defined', () => {
      const wrapper = mount(<Panel channel={testChannel} api={testApi} active />);
      try {
        wrapper.setState({
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

        const titles = wrapper
          .find(TabsState)
          // TabsState will replace the <div/> that Panel actually makes with a <Tab/>
          .find('Tab')
          .map(child => child.prop('name'));
        // the "ALL" tab is always defined
        expect(titles).toEqual(['foo', 'bar', 'ALL']);

        const knobs = wrapper.find(PropForm).map(propForm => propForm.prop('knobs'));
        // but it should not have its own PropForm in this case
        expect(knobs).toHaveLength(titles.length - 1);
        expect(knobs).toMatchSnapshot();
      } finally {
        wrapper.unmount();
      }
    });

    it('the ALL tab should have its own additional content when there are knobs both with and without a groupId', () => {
      const wrapper = mount(<Panel channel={testChannel} api={testApi} active />);
      try {
        wrapper.setState({
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

        const titles = wrapper
          .find(TabsState)
          // TabsState will replace the <div/> that Panel actually makes with a <Tab/>
          .find('Tab')
          .map(child => child.prop('name'));
        expect(titles).toEqual(['foo', 'ALL']);

        const knobs = wrapper.find(PropForm).map(propForm => propForm.prop('knobs'));
        // there are props with no groupId so ALL should also have its own PropForm
        expect(knobs).toHaveLength(titles.length);
        expect(knobs).toMatchSnapshot();
      } finally {
        wrapper.unmount();
      }
    });
  });
});
