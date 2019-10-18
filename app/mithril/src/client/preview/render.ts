import { document } from 'global';
/** @jsx m */

import m from 'mithril';
import dedent from 'ts-dedent';

import { RenderMainArgs } from './types';

const rootEl = document.getElementById('root');

export default function renderMain({
  storyFn,
  selectedKind,
  selectedStory,
  showMain,
  showError,
}: RenderMainArgs) {
  const element = storyFn();

  if (!element) {
    const error = {
      title: `Expecting a Mithril element from the story: "${selectedStory}" of "${selectedKind}".`,
      description: dedent`
        Did you forget to return the Mithril element from the story?
        Use "() => MyComp" or "() => { return MyComp; }" when defining the story.
      `,
    };
    showError(error);
    return;
  }

  showMain();
  m.mount(rootEl, { view: () => m(element) });
}
