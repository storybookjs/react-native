import { addons } from '@storybook/addons';
import { EVENTS } from './constants';

const run = async () => {
  const channel = await addons.ready();

  channel.on(EVENTS.REQUEST, () => {
    // do something in the preview context
    // then report back to the manager
    channel.emit(EVENTS.RESULT, ['from the preview']);
  });
};

run();
