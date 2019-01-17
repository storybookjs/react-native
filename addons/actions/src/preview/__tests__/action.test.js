import addons from '@storybook/addons';
import { action } from '../..';
// import { configureActions } from '../..';

jest.mock('@storybook/addons');

const createChannel = () => {
  const channel = { emit: jest.fn() };
  addons.getChannel.mockReturnValue(channel);
  return channel;
};
const getChannelData = channel => channel.emit.mock.calls[0][1].data.args;

describe('Action', () => {
  it('with one argument', () => {
    const channel = createChannel();

    action('test-action')('one');

    expect(getChannelData(channel)[0]).toEqual('one');
  });

  it('with multiple arguments', () => {
    const channel = createChannel();

    action('test-action')('one', 'two', 'three');

    expect(getChannelData(channel)).toEqual(['one', 'two', 'three']);
  });
});

// TODO: This functionality is removed, unsure if to add back or remove
// describe('Depth config', () => {
//   it('with global depth configuration', () => {
//     const channel = createChannel();

//     const depth = 1;

//     configureActions({
//       depth,
//     });

//     action('test-action')({
//       root: {
//         one: {
//           two: 'foo',
//         },
//       },
//     });

//     expect(getChannelData(channel)[0]).toEqual({
//       root: {
//         one: {
//           two: 'foo',
//         },
//       },
//     });
//   });

//   it('per action depth option overrides global config', () => {
//     const channel = createChannel();

//     configureActions({
//       depth: 1,
//     });

//     action('test-action', { depth: 3 })({
//       root: {
//         one: {
//           two: {
//             three: {
//               four: {
//                 five: 'foo',
//               },
//             },
//           },
//         },
//       },
//     });

//     expect(getChannelData(channel)[0]).toEqual({
//       root: {
//         one: {
//           two: {
//             three: {
//               four: {
//                 five: 'foo',
//               },
//             },
//           },
//         },
//       },
//     });
//   });
// });
