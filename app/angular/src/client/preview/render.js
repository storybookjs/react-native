import { renderNgApp } from './angular/helpers';

export default function render({ storyFn, showMain }) {
  showMain();
  renderNgApp(storyFn);
}
