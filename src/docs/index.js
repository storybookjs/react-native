const data = {
  sections: [
    {
      id: 'basics',
      heading: 'Basics',
      items: [
        require('./basics/introduction').default,
        require('./basics/quick-start-guide').default,
        require('./basics/slow-start-guide').default,
        require('./basics/writing-stories').default,
        require('./basics/exporting-storybook').default,
      ]
    },
    {
      id: 'configurations',
      heading: 'Configurations',
      items: [
        require('./configurations/default-config').default,
        require('./configurations/custom-webpack-config').default,
        require('./configurations/custom-babel-config').default,
        require('./configurations/add-custom-head-tags').default,
        require('./configurations/serving-static-files').default,
        require('./configurations/cli-options').default,
      ]
    },
    {
      id: 'addons',
      heading: 'Addons',
      items: [
        require('./addons/introduction').default,
        require('./addons/using-addons').default,
        require('./addons/addon-galary').default,
        require('./addons/writing-addons').default,
        require('./addons/api').default,
      ]
    },
  ],
};

export function getNavigationData() {
  return data.sections;
}

export function getItem(sectionId, itemId) {
  const section = data.sections.find(section => section.id === sectionId);
  if (!section) return null;

  const item = section.items.find(item => item.id === itemId);
  return item;
}

export function getFirstItemOfSection(sectionId) {
  const section = data.sections.find(section => section.id === sectionId);
  if (!section) return null;

  return section.items[0];
}

export function getFirstItem() {
  const sections = data.sections || [];
  if (sections.length === 0) return null;

  return sections[0].items[0];
}
