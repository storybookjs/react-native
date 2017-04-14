import PropTypes from 'prop-types';
import React from 'react';
import Nav from '../Nav';
import NavDropdown from '../Nav/dropdown';
import Content from '../Content';
import './style.css';

class Container extends React.Component {
  renderTopNav(cat) {
    const { selectedCatId } = this.props;
    const path = `/docs/${cat.id}`;

    if (selectedCatId === cat.id) {
      return <li className="selected" key={cat.id}>{cat.title}</li>;
    }

    return <a key={cat.id} href={path}><li>{cat.title}</li></a>;
  }

  render() {
    const {
      categories,
      selectedCatId,
      sections,
      selectedItem,
      selectedSectionId,
      selectedItemId,
    } = this.props;

    const gitHubRepoUrl = 'https://github.com/kadirahq/getstorybook.io';
    const docPath = `${selectedCatId}/${selectedSectionId}/${selectedItemId}`;
    const gitHubRepoDocUrl = `${gitHubRepoUrl}/tree/master/src/docs/${docPath}.js`;

    return (
      <div id="docs-container" className="row">
        <div className="row">
          <div className="col-xs-12">
            <ul className="top-nav">
              {categories.map(this.renderTopNav.bind(this))}
            </ul>
          </div>
        </div>

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
