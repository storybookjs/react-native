import addons from '@storybook/addons';
import uuid from 'uuid/v1';
import { action } from '..';
import { undefinedType, symbolType } from '../../lib/types';

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

    it('should be able to handle non plain object', () => {
      function A(val) {
        this.a = val;
      }

      const a = new A('b');

      const channel = { emit: jest.fn() };
      addons.getChannel.mockReturnValue(channel);

      action('foo')(a);

      expect(JSON.parse(channel.emit.mock.calls[0][1].data.args[0])).toEqual({
        '$___storybook.objectName': 'A',
        a: 'b',
      });
    });

    it('should be able to handle non plain cyclic object', () => {
      function A() {}
      const a = new A();
      a.a = a;

      const channel = { emit: jest.fn() };
      addons.getChannel.mockReturnValue(channel);

      action('foo')(a);

      expect(JSON.parse(channel.emit.mock.calls[0][1].data.args[0])).toEqual({
        '$___storybook.objectName': 'A',
        '$___storybook.isCyclic': true,
        a: {
          $ref: '$',
        },
      });
    });

    describe('should be able to emit primitive value type:', () => {
      [true, false, null, 10, 'a'].forEach(value => {
        it(`${typeof value} value ${JSON.stringify(value)}`, () => {
          const channel = { emit: jest.fn() };
          addons.getChannel.mockReturnValue(channel);

          action('foo')(value);

          expect(JSON.parse(channel.emit.mock.calls[0][1].data.args[0])).toBe(value);
        });
      });

      it('undefined value', () => {
        const channel = { emit: jest.fn() };
        addons.getChannel.mockReturnValue(channel);

        action('foo')(undefined);

        expect(JSON.parse(channel.emit.mock.calls[0][1].data.args[0])).toEqual({
          [undefinedType.KEY]: true,
        });
      });

      it('symbol value', () => {
        const channel = { emit: jest.fn() };
        addons.getChannel.mockReturnValue(channel);

        action('foo')(Symbol('A Symbol'));

        expect(JSON.parse(channel.emit.mock.calls[0][1].data.args[0])).toEqual({
          [symbolType.KEY]: 'A Symbol',
        });
      });
    });
  });
});
