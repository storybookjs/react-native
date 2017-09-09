import { location } from 'global';
import addons from '@storybook/addons';
import { ADDON_ID, EVENT_ID, REQUEST_HREF_EVENT_ID, RECEIVE_HREF_EVENT_ID } from './';

export function register() {
  addons.register(ADDON_ID, api => {
    const channel = addons.getChannel();
    channel.on(EVENT_ID, selection => {
      if (selection.kind != null) {
        api.selectStory(selection.kind, selection.story);
      } else {
        api.selectInCurrentKind(selection.story);
      }
    });
    channel.on(REQUEST_HREF_EVENT_ID, selection => {
      const params =
        selection.kind != null
          ? {
              selectedKind: selection.kind,
              selectedStory: selection.story,
            }
          : {
              selectedStory: selection.story,
            };
      const urlState = api.getUrlState(params);
      channel.emit(RECEIVE_HREF_EVENT_ID, location.pathname + urlState.url);
    });
  });
}
