function fillHierarchy(namespaces, hierarchy, story) {
  if (namespaces.length === 1) {
    const namespace = namespaces[0];
    const childItems = hierarchy.map.get(namespace) || [];

    childItems.push(story);
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
      map: new Map(),
    };

    childItems.push(childHierarchy);
    hierarchy.map.set(namespace, childItems);
  }

  fillHierarchy(namespaces.slice(1), childHierarchy, story);
}

export function resolveStoryHierarchy(storyName = '', hierarchySeparator) {
  if (!hierarchySeparator) {
    return [storyName];
  }

  return storyName.split(new RegExp(hierarchySeparator));
}

export function createHierarchy(stories, hierarchySeparator) {
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
