import { document } from 'global';
import React from 'react';
import ReactDOM from 'react-dom';
import { stripIndents } from 'common-tags';
import isReactRenderable from './element_check';

const rootEl = document ? document.getElementById('root') : null;

function render(node, el) {
  ReactDOM.render(
    process.env.STORYBOOK_EXAMPLE_APP ? <React.StrictMode>{node}</React.StrictMode> : node,
    el
  );
}

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
      title: `Expecting a React element from the story: "${selectedStory}" of "${selectedKind}".`,
      description: stripIndents`
        Did you forget to return the React element from the story?
        Use "() => (<MyComp/>)" or "() => { return <MyComp/>; }" when defining the story.
      `,
    });
    return;
  }

  if (!isReactRenderable(element)) {
    showError({
      title: `Expecting a valid React element from the story: "${selectedStory}" of "${selectedKind}".`,
      description: stripIndents`
         Seems like you are not returning a correct React element from the story.
         Could you double check that?
       `,
    });
    return;
  }

  // We need to unmount the existing set of components in the DOM node.
  // Otherwise, React may not recreate instances for every story run.
  // This could leads to issues like below:
  //    https://github.com/storybooks/react-storybook/issues/81
  // But forceRender means that it's the same story, so we want too keep the state in that case.
  if (!forceRender) {
    ReactDOM.unmountComponentAtNode(rootEl);
  }
  showMain();
  render(element, rootEl);
}
