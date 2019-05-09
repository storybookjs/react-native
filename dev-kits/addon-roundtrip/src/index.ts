import { addons } from '@storybook/addons';
import { EVENTS } from './constants';

const run = async () => {
  const channel = await addons.ready();

  channel.on(EVENTS.REQUEST, () => {
    channel.emit(EVENTS.RESULT, ['from the preview']);
  });
};

run();
