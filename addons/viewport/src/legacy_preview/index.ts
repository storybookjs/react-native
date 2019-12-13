import deprecate from 'util-deprecate';

export { INITIAL_VIEWPORTS, DEFAULT_VIEWPORT, MINIMAL_VIEWPORTS } from '../defaults';

export const configureViewport = deprecate(() => {},
'configureViewport is no longer supported, use .addParameters({ viewport }) instead');
