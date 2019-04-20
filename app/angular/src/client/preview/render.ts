import { renderNgApp } from './angular/helpers';

// add proper types
export default function render({ storyFn, showMain, forceRender }: any) {
  showMain();
  renderNgApp(storyFn, forceRender);
}
