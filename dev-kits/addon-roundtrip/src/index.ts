import { useChannel } from '@storybook/client-api';
import { EVENTS } from './constants';

export const withRoundtrip = (storyFn: () => any) => {
  const emit = useChannel({
    [EVENTS.REQUEST]: () => {
      emit(EVENTS.RESULT, ['from the preview']);
    },
  });
  return storyFn();
};
