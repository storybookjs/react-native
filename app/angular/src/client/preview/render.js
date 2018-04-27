import { renderNgApp } from './angular/helpers';

export default function render({ story, showMain }) {
  renderNgApp(story);
  showMain();
}
