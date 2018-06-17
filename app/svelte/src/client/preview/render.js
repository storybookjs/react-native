import { stripIndents } from 'common-tags';

const target = document.getElementById('root'); // eslint-disable-line

export default function render({
  story,
  selectedKind,
  selectedStory,
  showMain,
  showError,
  // showException,
}) {
  const { Component, data } = story();

  target.innerHTML = '';

  if (!Component) {
    showError({
      title: `Expecting a Svelte component from the story: "${selectedStory}" of "${selectedKind}".`,
      description: stripIndents`
        Did you forget to return the Svelte component from the story?
        Use "() => ({ Component: YourComponent, data: {} })"
        when defining the story.
      `,
    });

    return;
  }

  new Component({target, data}); // eslint-disable-line

  showMain();
}
