import { renderNgApp } from './angular/helpers';

interface RenderArgs {
  story: any; // todo get typings from the correct package
  showMain: () => void;
}

export default function render({ story, showMain }: RenderArgs) {
  showMain();
  renderNgApp(story);
}
