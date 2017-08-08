function resolveStoryHierarchy(storyName = '', hierarchySeparator) {
  if (!hierarchySeparator) {
    return [storyName];
  }

  return storyName.split(new RegExp(hierarchySeparator));
}

function findMatches(matches, type, value) {
  if (!matches) {
    return null;
  }

  const matchForNamespace = matches
    .filter(match => match.key === type)
    .find(match => match.value === value);

  if (!matchForNamespace) {
    return null;
  }

  return [...matchForNamespace.indices];
}

function fillHierarchy(namespaces, hierarchy, story) {
  if (namespaces.length === 1) {
    const namespace = namespaces[0];
    const childItems = hierarchy.map.get(namespace) || [];

    const component = {
      kind: story.kind,
      name: story.name,
      namespaces: story.namespaces,
      stories: story.stories.map(s => ({
        name: s,
        highlight: findMatches(story.matches, 'stories', s),
      })),
      highlight: findMatches(story.matches, 'namespaces', namespace),
    };

    childItems.push(component);
    hierarchy.map.set(namespace, childItems);
    return;
  }

  const namespace = namespaces[0];
  const childItems = hierarchy.map.get(namespace) || [];
  let childHierarchy = childItems.find(item => item.isNamespace);

  if (!childHierarchy) {
    childHierarchy = {
      isNamespace: true,
      name: namespace,
      namespaces: [...hierarchy.namespaces, namespace],
      firstKind: story.kind,
      highlight: findMatches(story.matches, 'namespaces', namespace),
      map: new Map(),
    };

    childItems.push(childHierarchy);
    hierarchy.map.set(namespace, childItems);
  }

  fillHierarchy(namespaces.slice(1), childHierarchy, story);
}

function createSimpleHierarchy(stories, hierarchySeparator) {
  const hierarchyRoot = {
    isNamespace: true,
    namespaces: [],
    name: '',
    map: new Map(),
  };

  if (!stories) {
    return hierarchyRoot;
  }

  const groupedStories = stories.map(story => {
    const namespaces = resolveStoryHierarchy(story.kind, hierarchySeparator);

    return {
      namespaces,
      name: namespaces[namespaces.length - 1],
      ...story,
    };
  });

  groupedStories.forEach(story => fillHierarchy(story.namespaces, hierarchyRoot, story));

  return hierarchyRoot;
}

function createFilteredHierarchy(stories) {
  const hierarchyRoot = {
    isNamespace: true,
    namespaces: [],
    name: '',
    map: new Map(),
  };

  if (!stories) {
    return hierarchyRoot;
  }

  const groupedStories = stories.map(filteredStory => {
    const story = filteredStory.item;
    const namespaces = story.namespaces;

    return {
      namespaces,
      name: namespaces[namespaces.length - 1],
      matches: filteredStory.matches,
      ...story,
    };
  });

  groupedStories.forEach(story => fillHierarchy(story.namespaces, hierarchyRoot, story));

  return hierarchyRoot;
}

function createHierarchy(stories, hierarchySeparator) {
  if (stories && stories.length && stories[0].score) {
    return createFilteredHierarchy(stories);
  }

  return createSimpleHierarchy(stories, hierarchySeparator);
}

export { resolveStoryHierarchy, createHierarchy };
