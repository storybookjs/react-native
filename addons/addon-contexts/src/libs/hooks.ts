import { useEffect } from 'react';
import addons from '@storybook/addons';
import { UseChannel } from '../@types';

export const useChannel: UseChannel = (event, eventHandler, inputs = []) =>
  useEffect(() => {
    const channel = addons.getChannel();
    channel.on(event, eventHandler);
    return () => channel.removeListener(event, eventHandler);
  }, inputs);
