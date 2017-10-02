import addons from '@storybook/addons';
import uuid from 'uuid/v1';
import { action } from './preview';

jest.mock('uuid/v1');
jest.mock('@storybook/addons');

describe('preview', () => {
  describe('action()', () => {
    it('should use a uuid for action ids', () => {
      const channel = { emit: jest.fn() };
      const uuidGenerator = (function* uuidGenerator() {
        yield '42';
        yield '24';
      })();
      uuid.mockImplementation(() => uuidGenerator.next().value);
      addons.getChannel.mockReturnValue(channel);
      const fn = action('foo');

      fn();
      fn();
      expect(channel.emit).toHaveBeenCalledTimes(2);
      expect(channel.emit.mock.calls[0][1].id).toBe('42');
      expect(channel.emit.mock.calls[1][1].id).toBe('24');
    });
    it('should be able to handle cyclic object without hanging', () => {
      const cyclicObject = {
        propertyA: {
          innerPropertyA: {},
        },
        propertyB: 'b',
      };
      cyclicObject.propertyA.innerPropertyA = cyclicObject;

      expect(() => JSON.stringify(cyclicObject)).toThrow();
      expect(() => action('foo')(cyclicObject)).not.toThrow();
    });
  });
});
