import { StoryFn } from '@storybook/addons';

import { renderNgApp } from './angular/helpers';
import { StoryFnAngularReturnType } from './types';

// add proper types
export default function render({
  storyFn,
  showMain,
  forceRender,
}: {
  storyFn: StoryFn<StoryFnAngularReturnType>;
  showMain: () => void;
  forceRender: boolean;
}) {
  showMain();
  renderNgApp(storyFn, forceRender);
}
