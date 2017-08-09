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

export function createHierarchy(stories) {
  const hierarchyRoot = {
    isNamespace: true,
    namespaces: [],
    name: '',
    map: new Map(),
  };

  if (stories) {
    stories.forEach(story => fillHierarchy(story.namespaces, hierarchyRoot, story));
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
      namespaces,
      name: namespaces[namespaces.length - 1],
      ...story,
    };
  });
}
