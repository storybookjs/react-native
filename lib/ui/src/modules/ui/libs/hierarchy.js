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
  const namespace = namespaces[0];
  let childHierarchy = hierarchy.map.get(namespace);

  if (!childHierarchy) {
    childHierarchy = createNamespaceNode(namespace, hierarchy, story);
    hierarchy.map.set(namespace, childHierarchy);
  }

  if (namespaces.length === 1) {
    childHierarchy.kind = story.kind;
    childHierarchy.stories = story.stories.map(s => ({
      name: s,
      highlight: findMatches(story.matches, 'stories', s),
    }));

    return;
  }

  fillHierarchy(namespaces.slice(1), childHierarchy, story);
}

export function createHierarchyRoot(name = '') {
  return {
    isNamespace: true,
    namespaces: [],
    name,
    map: new Map(),
  };
}

function ensureMainRootIsFirst(hierarchies) {
  const mainRoot = hierarchies.find(hierarchy => hierarchy.name === '');
  const mainRootIndex = hierarchies.indexOf(mainRoot);
  if (mainRootIndex === -1 && hierarchies.length === 0) {
    hierarchies.push(createHierarchyRoot());
  } else if (mainRootIndex > 0) {
    hierarchies.unshift(...hierarchies.splice(mainRootIndex, 1));
  }
  return hierarchies;
}

export function createHierarchies(stories) {
  const rootMap = {};

  if (stories) {
    stories.forEach(story => {
      const { rootName = '', namespaces } = story;
      const name = namespaces[namespaces.length - 1];
      const hierarchyRoot =
        rootMap[rootName] || (rootMap[rootName] = createHierarchyRoot(rootName));

      fillHierarchy(namespaces, hierarchyRoot, { ...story, name });
    });
  }

  return ensureMainRootIsFirst(Object.values(rootMap));
}

export function resolveStoryHierarchyRoots(storyName = '', hierarchyRootSeparator) {
  if (!hierarchyRootSeparator) {
    return { rootName: '', storyName };
  }

  const segments = storyName.split(new RegExp(hierarchyRootSeparator));

  switch (segments.length) {
    case 1:
      return { rootName: '', storyName };
    case 2:
      return { rootName: segments[0], storyName: segments[1] };
    default:
      throw new Error(`multiple root separators found in story name: ${storyName}`);
  }
}

export function resolveStoryHierarchy(storyName = '', hierarchySeparator) {
  if (!hierarchySeparator) {
    return [storyName];
  }

  return storyName.split(new RegExp(hierarchySeparator)).filter(segment => !!segment);
}

export function prepareStoriesForHierarchy(stories, hierarchySeparator, hierarchyRootSeparator) {
  if (!stories) {
    return null;
  }

  return stories.map(story => {
    const { rootName, storyName } = resolveStoryHierarchyRoots(story.kind, hierarchyRootSeparator);
    const namespaces = resolveStoryHierarchy(storyName, hierarchySeparator);

    return {
      ...story,
      rootName,
      namespaces,
    };
  });
}
