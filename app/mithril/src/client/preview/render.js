/* global document */
/** @jsx m */

import m from 'mithril';
import { stripIndents } from 'common-tags';

const rootEl = document.getElementById('root');

export default function renderMain({ story, selectedKind, selectedStory, showMain, showError }) {
  const element = story();

  if (!element) {
    const error = {
      title: `Expecting a Mithril element from the story: "${selectedStory}" of "${selectedKind}".`,
      description: stripIndents`
        Did you forget to return the Mithril element from the story?
        Use "() => MyComp" or "() => { return MyComp; }" when defining the story.
      `,
    };
    showError(error);
    return;
  }

  m.mount(rootEl, { view: () => m(element) });
  showMain();
}
