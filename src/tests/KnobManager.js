import sinon from 'sinon';
import { expect } from 'chai';
import KnobManager from '../KnobManager';
const { describe, it, beforeEach } = global;

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
  });
});
