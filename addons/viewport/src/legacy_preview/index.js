import deprecate from 'util-deprecate';

export { INITIAL_VIEWPORTS, DEFAULT_VIEWPORT } from '../defaults';
export { default as withViewport, Viewport } from './withViewport';

export const configureViewport = deprecate(() => {},
'usage is deprecated, use .addParameters({ viewport }) instead');
