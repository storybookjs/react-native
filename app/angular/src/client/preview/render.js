import { renderNgApp } from './angular/helpers';

export default function render({ storyFn, showMain, forceRender }) {
  showMain();
  renderNgApp(storyFn, forceRender);
}
