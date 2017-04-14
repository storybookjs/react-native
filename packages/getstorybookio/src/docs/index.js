const data = {
  'react-storybook': {
    title: 'React Storybook',
    sections: require('./react-storybook').default,
  },
  'storybook-hub': {
    title: 'Storybook Hub',
    sections: require('./storybook-hub').default,
  },
};

export function getCategories() {
  const catIds = Object.keys(data);
  const categories = [];

  catIds.forEach(catId => {
    categories.push({
      id: catId,
      title: data[catId].title,
    });
  });

  return categories;
}

export function getNavigationData(catId) {
  if (!catId) {
    catId = getCategories[0].id;
  }

  return data[catId].sections;
}

export function getItem(catId, sectionId, itemId) {
  if (!catId) {
    catId = getCategories[0].id;
  }

  const section = data[catId].sections.find(section => section.id === sectionId);
  if (!section) return null;

  const item = section.items.find(item => item.id === itemId);
  return item;
}

export function getFirstItemOfSection(catId, sectionId) {
  if (!catId) {
    catId = getCategories[0].id;
  }

  const section = data[catId].sections.find(section => section.id === sectionId);
  if (!section) return null;

  return section.items[0];
}

export function getFirstItem(catId) {
  if (!catId) {
    catId = getCategories[0].id;
  }

  const sections = data[catId].sections || [];
  if (sections.length === 0) return null;

  return sections[0].items[0];
}
