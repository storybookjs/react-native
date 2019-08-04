export interface Loader {
  load: (options: any) => any;
  test: (options: any) => boolean;
}
