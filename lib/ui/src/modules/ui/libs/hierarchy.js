function findMatches(matches, type, value) {
  if (!matches) {
    return null;
  }

  const matchForType = matches
    .filter(match => match.key === type)
    .find(match => match.value === value);

  if (!matchForType) {
    return null;
  }

  return matchForType.indices;
}

function createComponentNode(namespace, story) {
  return {
    name: story.name,
    namespaces: story.namespaces,
    highlight: findMatches(story.matches, 'namespaces', namespace),
    kind: story.kind,
    stories: story.stories.map(s => ({
      name: s,
      highlight: findMatches(story.matches, 'stories', s),
    })),
  };
}

function createNamespaceNode(namespace, hierarchy, story) {
  return {
    isNamespace: true,
    name: namespace,
    namespaces: [...hierarchy.namespaces, namespace],
    highlight: findMatches(story.matches, 'namespaces', namespace),
    map: new Map(),
  };
}

function fillHierarchy(namespaces, hierarchy, story) {
  if (namespaces.length === 1) {
    const namespace = namespaces[0];
    const childItems = hierarchy.map.get(namespace) || [];
    const component = createComponentNode(namespace, story);

    childItems.push(component);
    hierarchy.map.set(namespace, childItems);
    return;
  }

  const namespace = namespaces[0];
  const childItems = hierarchy.map.get(namespace) || [];
  let childHierarchy = childItems.find(item => item.isNamespace);

  if (!childHierarchy) {
    childHierarchy = createNamespaceNode(namespace, hierarchy, story);
    childItems.push(childHierarchy);
    hierarchy.map.set(namespace, childItems);
  }

  fillHierarchy(namespaces.slice(1), childHierarchy, story);
}

export function createHierarchy(stories) {
  const hierarchyRoot = {
    isNamespace: true,
    namespaces: [],
    name: '',
    map: new Map(),
  };

  if (stories) {
    stories.forEach(story => {
      const { namespaces } = story;
      const name = namespaces[namespaces.length - 1];

      fillHierarchy(namespaces, hierarchyRoot, { ...story, name });
    });
  }

  return hierarchyRoot;
}

export function resolveStoryHierarchy(storyName = '', hierarchySeparator) {
  if (!hierarchySeparator) {
    return [storyName];
  }

  return storyName.split(new RegExp(hierarchySeparator));
}

export function prepareStoriesForHierarchy(stories, hierarchySeparator) {
  if (!stories) {
    return null;
  }

  return stories.map(story => {
    const namespaces = resolveStoryHierarchy(story.kind, hierarchySeparator);

    return {
      ...story,
      namespaces,
    };
  });
}
