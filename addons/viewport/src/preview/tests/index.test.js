import addons from '@storybook/addons';
import { configureViewport } from '..';

jest.mock('@storybook/addons');

describe('Viewport preview', () => {
  const channel = {
    emit: jest.fn(),
    on: jest.fn(),
  };
  addons.getChannel.mockReturnValue(channel);

  describe('configureViewport', () => {
    it('publishes configure event with all passed configurations', () => {
      const configs = {
        foo: 'bar',
        john: 'Doe',
      };
      configureViewport(configs);

      expect(channel.emit).toHaveBeenCalledTimes(1);
      expect(channel.emit).toHaveBeenCalledWith('addon:viewport:configure', {
        foo: 'bar',
        john: 'Doe',
      });
    });
  });
});
