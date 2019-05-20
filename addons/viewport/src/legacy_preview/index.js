import deprecate from 'util-deprecate';

export { INITIAL_VIEWPORTS, DEFAULT_VIEWPORT } from '../defaults';
export { default as withViewport } from './withViewport';

export const configureViewport = deprecate(() => {},
'configureViewport is no longer supported, use .addParameters({ viewport }) instead');
