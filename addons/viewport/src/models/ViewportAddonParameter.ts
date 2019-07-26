import { ViewportMap } from './Viewport';

export interface ViewportAddonParameter {
  disable?: boolean;
  defaultViewport?: string;
  viewports: ViewportMap;
  /*
   * @deprecated
   * The viewport parameter `onViewportChange` is no longer supported
   */
  onViewportChange?: never;
}
