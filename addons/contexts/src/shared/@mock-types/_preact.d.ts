/**
 * Preact v8.4.2 shipped with global polluted JSX typing, which breaks the React components typing under Manager
 */
declare module 'preact' {
  declare type VNode = any;
  declare const h: any = () => {};
}
