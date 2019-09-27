import { document } from 'global';
import dedent from 'ts-dedent';
import { unregister } from 'riot';
import { render as renderRiot } from './rendering';

export default function renderMain({
  storyFn,
  selectedKind,
  selectedStory,
  showMain = () => {},
  showError = () => {},
}) {
  showMain();
  unregister('#root');
  const rootElement = document.getElementById('root');
  rootElement.innerHTML = '';
  rootElement.dataset.is = 'root';
  const element = storyFn();
  const rendered = renderRiot(element);
  if (!rendered) {
    showError({
      title: `Expecting a riot snippet or a riot component from the story: "${selectedStory}" of "${selectedKind}".`,
      description: dedent`
        Did you forget to return the component snippet from the story?
        Use "() => <your snippet or node>" or when defining the story.
      `,
    });
  }
  return rendered;
}
