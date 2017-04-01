import React from 'react';
import { shallow } from 'enzyme';
import Panel from '../Panel';
import { expect } from 'chai';
import sinon from 'sinon';
const { describe, it } = global;

describe('Panel', () => {
  it('should subscribe to setKnobs event of channel', () => {
    const testChannel = { on: sinon.spy() };
    shallow(<Panel channel={testChannel} />);
    expect(testChannel.on.calledWith('addon:knobs:setKnobs')).to.equal(true);
  });

  describe('setKnobs handler', () => {
    it('should read url params and set values for existing knobs', () => {
      const handlers = {};

      const testChannel = {
        on: (e, handler) => {
          handlers[e] = handler;
        },
        emit: sinon.spy()
      };

      const testQueryParams = {
        'knob-foo': 'test string',
        bar: 'some other string'
      };

      const testApi = {
        getQueryParam: key => testQueryParams[key],
        setQueryParams: sinon.spy()
      };

      shallow(<Panel channel={testChannel} api={testApi} />);
      const setKnobsHandler = handlers['addon:knobs:setKnobs'];

      const knobs = {
        foo: {
          name: 'foo',
          value: 'default string',
          type: 'text'
        },
        baz: {
          name: 'baz',
          value: 'another knob value',
          type: 'text'
        }
      };

      setKnobsHandler(knobs);
      const knobFromUrl = {
        name: 'foo',
        value: testQueryParams['knob-foo'],
        type: 'text'
      };
      const e = 'addon:knobs:knobChange';
      expect(testChannel.emit.calledWith(e, knobFromUrl)).to.equal(true);
    });

    it('should set query params when url params are already read', () => {
      const handlers = {};

      const testChannel = {
        on: (e, handler) => {
          handlers[e] = handler;
        },
        emit: sinon.spy()
      };

      const testQueryParams = {
        'knob-foo': 'test string',
        bar: 'some other string'
      };

      const testApi = {
        getQueryParam: key => testQueryParams[key],
        setQueryParams: sinon.spy()
      };

      const wrapper = shallow(<Panel channel={testChannel} api={testApi} />);
      const setKnobsHandler = handlers['addon:knobs:setKnobs'];

      const knobs = {
        foo: {
          name: 'foo',
          value: 'default string',
          type: 'text'
        },
        baz: {
          name: 'baz',
          value: 'another knob value',
          type: 'text'
        }
      };

      // Make it act like that url params are already checked
      wrapper.instance().loadedFromUrl = true;

      setKnobsHandler(knobs);
      const knobFromStory = {
        'knob-foo': knobs.foo.value,
        'knob-baz': knobs.baz.value
      };

      expect(testApi.setQueryParams.calledWith(knobFromStory)).to.equal(true);
    });
  });

  describe('handleChange()', () => {
    it('should set queryParams and emit knobChange event', () => {
      const testChannel = {
        on: sinon.spy(),
        emit: sinon.spy()
      };

      const testApi = {
        getQueryParam: sinon.spy(),
        setQueryParams: sinon.spy()
      };

      const wrapper = shallow(<Panel channel={testChannel} api={testApi} />);

      const testChangedKnob = {
        name: 'foo',
        value: 'changed text',
        type: 'text'
      };
      wrapper.instance().handleChange(testChangedKnob);
      expect(testChannel.emit.calledWith('addon:knobs:knobChange', testChangedKnob)).to.equal(true);

      const paramsChange = { 'knob-foo': 'changed text' };
      expect(testApi.setQueryParams.calledWith(paramsChange)).to.equal(true);
    });
  });
});
