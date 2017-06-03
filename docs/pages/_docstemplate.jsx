import React from 'react';
import PropTypes from 'prop-types';
import capitalize from 'lodash/capitalize';

import Docs from '../components/Docs';
import { config } from '../config.toml';

const categories = [
  {
    id: 'react-storybook',
    title: 'React Storybook',
  },
];

const getSections = (catId, options, pages) => {
  // FIXME: use catId
  const sections = Object.keys(options.docSections);
  return sections.map(key => ({
    id: key,
    heading: capitalize(key),
    items: options.docSections[key].map(path => {
      const page = pages.find(p => p.path === path);
      return page.data;
    }),
  }));
};

const getSelectedItem = (children, sectionId) => {
  const { data } = children.props.route.page;
  return {
    id: data.id,
    section: sectionId,
    title: data.title,
    content: data.body,
  };
};

const parsePath = path => {
  const comps = path.split('/');
  const [, itemId, sectionId, catId] = comps.reverse();
  return { catId, sectionId, itemId };
};

const DocsContainer = props => {
  const { pages } = props.route;
  const { children } = props;
  const { catId, sectionId, itemId } = parsePath(children.props.route.path);

  const docProps = {
    categories,
    selectedCatId: catId,
    sections: getSections(catId, config, pages),
    selectedItem: getSelectedItem(children, sectionId),
    selectedSectionId: sectionId,
    selectedItemId: itemId,
  };

  return <Docs {...docProps} />;
};

DocsContainer.propTypes = {
  location: PropTypes.object, // eslint-disable-line
  route: PropTypes.object, // eslint-disable-line
  children: PropTypes.node.isRequired,
};
DocsContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default DocsContainer;
