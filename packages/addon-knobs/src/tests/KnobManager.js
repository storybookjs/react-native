import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import KnobManager from '../KnobManager';

describe('KnobManager', () => {
  describe('knob()', () => {
    describe('when the knob is present in the knobStore', () => {
      const testManager = new KnobManager();

      beforeEach(() => {
        testManager.knobStore = {
          set: sinon.spy(),
          get: () => ({
            defaultValue: 'default value',
            value: 'current value',
            name: 'foo',
          }),
        };
      });

      it('should return the existing knob value when defaults match', () => {
        const defaultKnob = {
          name: 'foo',
          value: 'default value',
        };
        const knob = testManager.knob('foo', defaultKnob);
        expect(knob).to.equal('current value');
        expect(testManager.knobStore.set.callCount).to.equal(0);
      });

      it('should return the new default knob value when default has changed', () => {
        const defaultKnob = {
          name: 'foo',
          value: 'changed default value',
        };
        testManager.knob('foo', defaultKnob);

        const newKnob = {
          ...defaultKnob,
          defaultValue: defaultKnob.value,
        };

        expect(testManager.knobStore.set.calledWith('foo', newKnob)).to.equal(true);
      });
    });

    describe('when the knob is not present in the knobStore', () => {
      const testManager = new KnobManager();

      beforeEach(() => {
        testManager.knobStore = {
          set: sinon.spy(),
          get: sinon.stub(),
        };

        testManager.knobStore.get.onFirstCall().returns(undefined);
        testManager.knobStore.get.onSecondCall().returns('normal value');
      });

      it('should return the new default knob value when default has changed', () => {
        const defaultKnob = {
          name: 'foo',
          value: 'normal value',
        };
        testManager.knob('foo', defaultKnob);

        const newKnob = {
          ...defaultKnob,
          defaultValue: defaultKnob.value,
        };

        expect(testManager.knobStore.set.calledWith('foo', newKnob)).to.equal(true);
      });
    });
  });

  describe('wrapStory()', () => {
    it('should contain the story and add correct props', () => {
      const testManager = new KnobManager();

      const testChannel = { emit: () => {} };
      const testStory = () => <div id="test-story">Test Content</div>;
      const testContext = {
        kind: 'Foo',
        story: 'bar baz',
      };
      const wrappedStory = testManager.wrapStory(testChannel, testStory, testContext);
      const wrapper = shallow(wrappedStory);
      expect(wrapper.find('#test-story')).to.have.length(1);

      const storyWrapperProps = wrappedStory.props;
      expect(storyWrapperProps.channel).to.equal(testChannel);
      expect(storyWrapperProps.context).to.equal(testContext);
    });
  });
});
