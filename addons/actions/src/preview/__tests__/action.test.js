import addons from '@storybook/addons';
import { action, configureActions } from '../..';

jest.mock('@storybook/addons');

const getChannelData = channel =>
  channel.emit.mock.calls[channel.emit.mock.calls.length - 1][1].data;

describe('Action', () => {
  const channel = { emit: jest.fn() };
  addons.getChannel.mockReturnValue(channel);

  it('with one argument', () => {
    action('test-action')('one');

    expect(getChannelData(channel).args[0]).toEqual('"one"');
  });

  it('with multiple arguments', () => {
    action('test-action')('one', 'two', 'three');

    expect(getChannelData(channel).args).toEqual(['"one"', '"two"', '"three"']);
  });

  it('with global depth configuration', () => {
    const depth = 1;

    configureActions({
      depth,
    });

    action('test-action')({
      root: {
        one: {
          two: 'foo',
        },
      },
    });

    expect(getChannelData(channel).args[0]).toEqual(
      JSON.stringify({
        '$___storybook.objectName': 'Object',
        root: {
          '$___storybook.objectName': 'Object',
          one: {
            '$___storybook.objectName': 'Object',
          },
        },
      })
    );
  });

  it('per action depth option overrides global config', () => {
    configureActions({
      depth: 1,
    });

    action('test-action', { depth: 3 })({
      root: {
        one: {
          two: {
            three: {
              four: {
                five: 'foo',
              },
            },
          },
        },
      },
    });

    expect(getChannelData(channel).args[0]).toEqual(
      JSON.stringify({
        '$___storybook.objectName': 'Object',
        root: {
          '$___storybook.objectName': 'Object',
          one: {
            '$___storybook.objectName': 'Object',
            two: {
              '$___storybook.objectName': 'Object',
              three: {
                '$___storybook.objectName': 'Object',
              },
            },
          },
        },
      })
    );
  });
});
