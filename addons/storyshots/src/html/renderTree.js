import { document, Node } from 'global';

function getRenderedTree(story, context) {
  const component = story.render(context);

  if (component instanceof Node) {
    return component;
  }

  const section = document.createElement('section');
  section.innerHTML = component;

  if (section.childElementCount > 1) {
    return section;
  }

  return section.firstChild;
}

export default getRenderedTree;
