import addons from '@storybook/addons';
import { configure } from '../';

jest.mock('@storybook/addons');

describe('Viewport preview', () => {
  const channel = {
    emit: jest.fn(),
  };
  addons.getChannel.mockReturnValue(channel);

  describe('configure', () => {
    it('publishes configure event with all passed configurations', () => {
      const configs = {
        foo: 'bar',
        john: 'Doe'
      };
      configure(configs);

      expect(channel.emit).toHaveBeenCalledTimes(1);
      expect(channel.emit).toHaveBeenCalledWith('addon:viewport:configure', {
        foo: 'bar',
        john: 'Doe'
      });
    });
  });
});
