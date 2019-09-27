import { createElement, render } from 'rax';
import * as DriverDOM from 'driver-dom';

import { document } from 'global';
import { stripIndents } from 'common-tags';

const rootElement = document ? document.getElementById('root') : null;

export default function renderMain({
  storyFn,
  selectedKind,
  selectedStory,
  showMain,
  showError,
  // forceRender,
}) {
  const Element = storyFn;

  if (!Element) {
    showError({
      title: `Expecting a Rax element from the story: "${selectedStory}" of "${selectedKind}".`,
      description: stripIndents`
        Did you forget to return the Rax element from the story?
        Use "() => (<MyComp/>)" or "() => { return <MyComp/>; }" when defining the story.
      `,
    });
    return;
  }

  showMain();

  render(createElement(Element), rootElement, {
    driver: DriverDOM,
  });
}
