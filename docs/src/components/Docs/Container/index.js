import PropTypes from 'prop-types';
import React from 'react';
import Nav from '../Nav';
import NavDropdown from '../Nav/dropdown';
import Content from '../Content';
import './style.css';

const getEditUrl = (selectedSectionId, selectedItemId) => {
  const gitHubRepoUrl = 'https://github.com/storybooks/storybook';
  const docPath = `${selectedSectionId}/${selectedItemId}`;

  return `${gitHubRepoUrl}/blob/master/docs/src/pages/${docPath}/index.md`;
};

const Container = ({ sections, selectedItem, selectedSectionId, selectedItemId }) => (
  <div id="docs-container" className="row">
    <div className="nav col-sm-3 col-md-3 hidden-xs">
      <Nav
        sections={sections}
        selectedSection={selectedItem.section}
        selectedItem={selectedItem.id}
        selectedSectionId={selectedSectionId}
        selectedItemId={selectedItemId}
      />
    </div>
    <div className="content col-xs-12 col-sm-9 col-md-9 col-lg-9">
      <div className="nav-dropdown">
        <NavDropdown
          sections={sections}
          selectedSection={selectedItem.section}
          selectedItem={selectedItem.id}
        />
      </div>

      <Content
        title={selectedItem.title}
        content={selectedItem.content}
        editUrl={getEditUrl(selectedSectionId, selectedItemId)}
      />

      <div className="nav-dropdown">
        <NavDropdown
          sections={sections}
          selectedSection={selectedItem.section}
          selectedItem={selectedItem.id}
        />
      </div>
    </div>
  </div>
);
Container.propTypes = {
  sections: PropTypes.array, // eslint-disable-line
  selectedItem: PropTypes.object, // eslint-disable-line
  selectedSectionId: PropTypes.string.isRequired,
  selectedItemId: PropTypes.string.isRequired,
};

export { Container as default };
