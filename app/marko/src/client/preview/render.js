import { document } from 'global';
import { stripIndents } from 'common-tags';

const rootEl = document.getElementById('root');
let currLoadedComponent = null; // currently loaded marko widget!

export default function renderMain({
  storyFn,
  selectedKind,
  selectedStory,
  showMain,
  showError,
  // forceRender,
}) {
  const element = storyFn();

  // We need to unmount the existing set of components in the DOM node.
  if (currLoadedComponent) {
    currLoadedComponent.destroy();
  }

  if (!element || !element.out) {
    showError({
      title: `Expecting a Marko element from the story: "${selectedStory}" of "${selectedKind}".`,
      description: stripIndents`
        Did you forget to return the Marko element from the story?
        Use "() => MyComp.renderSync({})" or "() => { return MyComp.renderSync({}); }" when defining the story.
      `,
    });
    return;
  }

  showMain();
  currLoadedComponent = element.appendTo(rootEl).getComponent();
}
