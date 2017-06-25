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
      current: namespace,
      namespaces: [...hierarchy.namespaces, namespace],
      firstKind: story.kind,
      map: new Map(),
    };

    childItems.push(childHierarchy);
    hierarchy.map.set(namespace, childItems);
  }

  fillHierarchy(namespaces.slice(1), childHierarchy, story);
}

export function createHierarchy(stories, resolveNamespace) {
  const hierarchyRoot = {
    isNamespace: true,
    namespaces: [],
    current: '',
    map: new Map(),
  };

  if (!stories) {
    return hierarchyRoot;
  }

  const groupedStories = stories.map(story => {
    const namespaces = resolveNamespace ? resolveNamespace(story.kind) : [story.kind];

    return {
      namespaces,
      name: namespaces[namespaces.length - 1],
      ...story,
    };
  });

  groupedStories.forEach(story => fillHierarchy(story.namespaces, hierarchyRoot, story));

  return hierarchyRoot;
}

export function isSelectedHierarchy(namespaces, selectedHierarchy) {
  if (!namespaces || !selectedHierarchy) {
    return false;
  }

  if (namespaces.length > selectedHierarchy.length) {
    return false;
  }

  return namespaces.reduce(
    (isSelected, namespace, index) => isSelected && namespace === selectedHierarchy[index],
    true
  );
}
