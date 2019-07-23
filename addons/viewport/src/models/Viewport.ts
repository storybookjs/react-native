export type Styles = ViewportStyles | ((s: ViewportStyles) => ViewportStyles) | null;

export interface Viewport {
  name: string;
  styles: Styles;
  type: 'desktop' | 'mobile' | 'tablet' | 'other';
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
