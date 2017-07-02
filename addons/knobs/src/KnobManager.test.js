import { shallow } from 'enzyme'; // eslint-disable-line
import KnobManager from './KnobManager';

describe('KnobManager', () => {
  describe('knob()', () => {
    describe('when the knob is present in the knobStore', () => {
      const testManager = new KnobManager();

      beforeEach(() => {
        testManager.knobStore = {
          set: jest.fn(),
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
        expect(knob).toEqual('current value');
        expect(testManager.knobStore.set).not.toHaveBeenCalled();
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

        expect(testManager.knobStore.set).toHaveBeenCalledWith('foo', newKnob);
      });
    });

    describe('when the knob is not present in the knobStore', () => {
      const testManager = new KnobManager();

      beforeEach(() => {
        testManager.knobStore = {
          set: jest.fn(),
          get: jest.fn(),
        };

        testManager.knobStore.get
          .mockImplementationOnce(() => undefined)
          .mockImplementationOnce(() => 'normal value');
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

        expect(testManager.knobStore.set).toHaveBeenCalledWith('foo', newKnob);
      });
    });
  });
});
