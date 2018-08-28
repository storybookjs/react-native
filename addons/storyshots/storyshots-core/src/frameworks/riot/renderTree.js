import { document } from 'global';

document.body = document.createElement('body');
// eslint-disable-next-line no-unused-vars
const rootElement = document.body.appendChild(document.createElement('root'));

function getRenderedTree(story, context) {
  story.render(context);

  return document.body.firstChild;
}

export default getRenderedTree;
