/* eslint-disable-next-line no-unused-vars */
import { h, render } from 'preact';
import { document } from 'global';
import { stripIndents } from 'common-tags';

const rootElement = document ? document.getElementById('root') : null;

let renderedStory;

export default function renderMain({
  story,
  selectedKind,
  selectedStory,
  showMain,
  showError,
  forceRender,
}) {
  const element = story();

  if (!element) {
    showError({
      title: `Expecting a Preact element from the story: "${selectedStory}" of "${selectedKind}".`,
      description: stripIndents`
        Did you forget to return the Preact element from the story?
        Use "() => (<MyComp/>)" or "() => { return <MyComp/>; }" when defining the story.
      `,
    });
    return;
  }

  if (!forceRender) {
    render(null, rootElement, renderedStory);
  }

  showMain();

  renderedStory = render(element, rootElement);
}
