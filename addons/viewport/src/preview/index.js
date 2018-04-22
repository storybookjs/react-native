import addons from '@storybook/addons';
import { CONFIGURE_VIEWPORT_EVENT_ID } from '../shared';

export { INITIAL_VIEWPORTS, DEFAULT_VIEWPORT } from '../shared';
export { default as withViewport } from './withViewport';
export { default as Viewport } from './components/Viewport';

export function configureViewport(configs = {}) {
  const channel = addons.getChannel();

  if (channel) {
    channel.emit(CONFIGURE_VIEWPORT_EVENT_ID, configs);
  }
}
