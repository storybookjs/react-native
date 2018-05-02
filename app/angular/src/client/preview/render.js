import { renderNgApp } from './angular/helpers';

export default function render({ story, showMain }) {
  showMain();
  renderNgApp(story);
}
