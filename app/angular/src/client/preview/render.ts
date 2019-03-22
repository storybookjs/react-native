import { renderNgApp } from './angular/helpers';

interface RenderArgs {
  storyFn: any; // todo get typings from the correct package
  showMain: () => void;
}

export default function render({ storyFn, showMain }: RenderArgs) {
  showMain();
  renderNgApp(storyFn);
}
