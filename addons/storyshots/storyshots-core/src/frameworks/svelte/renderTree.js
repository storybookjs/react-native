function getRenderedTree(story, context) {
  const storyElement = story.render(context);

  return storyElement;
}

export default getRenderedTree;
