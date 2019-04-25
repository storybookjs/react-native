import { shallow } from 'enzyme'; // eslint-disable-line
import KnobManager from './KnobManager';

jest.mock('global', () => ({
  navigator: { userAgent: 'browser', platform: '' },
  window: {
    __STORYBOOK_CLIENT_API__: undefined,
    addEventListener: jest.fn(),
    location: { search: '' },
    history: { replaceState: jest.fn() },
  },
  document: {
    addEventListener: jest.fn(),
    getElementById: jest.fn().mockReturnValue({}),
    body: { classList: { add: jest.fn(), remove: jest.fn() } },
    documentElement: {},
    location: { search: '?id=kind--story' },
  },
}));

describe('KnobManager', () => {
  describe('knob()', () => {
    describe('when the knob is present in the knobStore', () => {
      const testManager = new KnobManager();

      beforeEach(() => {
        testManager.knobStore = {
          set: jest.fn(),
          get: () => ({
            defaultValue: 'default value',
            name: 'foo',
            type: 'string',
            value: 'current value',
          }),
        };
      });

      it('should return the existing knob value when types match', () => {
        const defaultKnob = {
          name: 'foo',
          type: 'string',
          value: 'default value',
        };
        const knob = testManager.knob('foo', defaultKnob);
        expect(knob).toEqual('current value');
        expect(testManager.knobStore.set).not.toHaveBeenCalled();
      });

      it('should return the new default knob value when default has changed', () => {
        const defaultKnob = {
          name: 'foo',
          value: true,
          type: 'boolean',
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
