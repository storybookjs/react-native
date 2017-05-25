import PropTypes from 'prop-types';
import React from 'react';
import Nav from '../Nav';
import NavDropdown from '../Nav/dropdown';
import Content from '../Content';
import './style.css';

class Container extends React.Component {
  render() {
    const {
      categories,
      selectedCatId,
      sections,
      selectedItem,
      selectedSectionId,
      selectedItemId,
    } = this.props;

    const gitHubRepoUrl = 'https://github.com/storybooks/storybooks.github.io';
    const docPath = `${selectedCatId}/${selectedSectionId}/${selectedItemId}`;
    const gitHubRepoDocUrl = `${gitHubRepoUrl}/tree/source/pages/docs/${docPath}/index.md`;

    return (
      <div id="docs-container" className="row">
        <div className="nav col-sm-3 col-md-3 hidden-xs">
          <Nav
            selectedCatId={selectedCatId}
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
              selectedCatId={selectedCatId}
              sections={sections}
              selectedSection={selectedItem.section}
              selectedItem={selectedItem.id}
            />
          </div>

          <Content
            title={selectedItem.title}
            content={selectedItem.content}
            editUrl={gitHubRepoDocUrl}
          />

          <div className="nav-dropdown">
            <NavDropdown
              selectedCatId={selectedCatId}
              sections={sections}
              selectedSection={selectedItem.section}
              selectedItem={selectedItem.id}
            />
          </div>
        </div>
      </div>
    );
  }
}

Container.propTypes = {
  categories: PropTypes.array,
  selectedCatId: PropTypes.string,
  sections: PropTypes.array,
  selectedItem: PropTypes.object,
  selectedSectionId: PropTypes.string,
  selectedItemId: PropTypes.string,
};

export default Container;
