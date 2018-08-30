import { document } from 'global';
import { stripIndents } from 'common-tags';
import { mount, unregister, tag2 } from 'riot';
import compiler from 'riot-compiler';
import { render as renderRiot } from './render-riot';

export default function renderMain({
  story,
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
  const context = { unregister, mount, tag2, compiler };
  const component = story();
  const rendered = renderRiot(component, context);
  if (!rendered)
    showError({
      title: `Expecting a riot snippet or a riot component from the story: "${selectedStory}" of "${selectedKind}".`,
      description: stripIndents`
        Did you forget to return the component snippet from the story?
        Use "() => <your snippet or node>" or when defining the story.
      `,
    });
  return rendered;
}
