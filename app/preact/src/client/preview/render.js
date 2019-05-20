import { h, render } from 'preact';
import { document } from 'global';
import { stripIndents } from 'common-tags';

let renderedStory;
const rootElement = document ? document.getElementById('root') : null;

export default function renderMain({
  storyFn,
  selectedKind,
  selectedStory,
  showMain,
  showError,
  // forceRender,
}) {
  const element = storyFn();

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

  render(null, rootElement, renderedStory);

  showMain();

  renderedStory = render(element, rootElement);
}
