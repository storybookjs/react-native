import { document } from 'global';
import { stripIndents } from 'common-tags';
import Marionette from 'backbone.marionette';
import isMarionetteRenderable from './element_check';

const rootEl = document.getElementById('root');
const rootRegion = new Marionette.Region({ el: rootEl });

function render(view) {
  rootRegion.show(view);
}

export default function renderMain({ storyFn, selectedKind, selectedStory, showMain, showError }) {
  const element = storyFn();

  if (!element) {
    showError({
      title: `Expecting a Marionette View from the story: "${selectedStory}" of "${selectedKind}".`,
      description: stripIndents`
        Did you forget to return the React element from the story?
        Use "() => (<MyComp/>)" or "() => { return <MyComp/>; }" when defining the story.
      `,
    });
    return;
  }

  if (!isMarionetteRenderable(element)) {
    showError({
      title: `Expecting a valid Marionette View from the story: "${selectedStory}" of "${selectedKind}".`,
      description: stripIndents`
        Seems like you are not returning a correct Marionette View from the story.
        Could you double check that?
      `,
    });
    return;
  }

  render(element);
  showMain();
}
