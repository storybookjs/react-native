export interface Viewport {
  name: string;
  styles: ViewportStyles;
  type: 'desktop' | 'mobile' | 'tablet';
  /*
   * @deprecated
   * Deprecated option?
   */
  default?: boolean;
}

export interface ViewportStyles {
  height: string;
  width: string;
}

export interface ViewportMap {
  [key: string]: Viewport;
}
