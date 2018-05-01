import { document } from 'global';
import { stripIndents } from 'common-tags';

const rootEl = document.getElementById('root');
let currLoadedComponent = null; // currently loaded marko widget!

export default function renderMain({ story, selectedKind, selectedStory, showMain, showError }) {
  const element = story();

  // We need to unmount the existing set of components in the DOM node.
  if (currLoadedComponent) {
    currLoadedComponent.destroy();
  }

  if (!element || !element.out) {
    showError({
      message: `Expecting a Marko element from the story: "${selectedStory}" of "${selectedKind}".`,
      stack: stripIndents`
        Did you forget to return the Marko element from the story?
        Use "() => MyComp.renderSync({})" or "() => { return MyComp.renderSync({}); }" when defining the story.
      `,
    });
    return;
  }

  currLoadedComponent = element.appendTo(rootEl).getComponent();
  showMain();
}
