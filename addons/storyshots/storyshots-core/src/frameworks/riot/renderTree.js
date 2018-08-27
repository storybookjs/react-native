import { document } from 'global';

function getRenderedTree(story, context) {
  story.render(context);

  return document.body.firstChild;
}

export default getRenderedTree;
