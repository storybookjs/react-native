import PropTypes from 'prop-types';
import React from 'react';
import './style.css';

class Nav extends React.Component {
  renderNavItem(section, item) {
    const { selectedCatId, selectedSectionId, selectedItemId } = this.props;
    const cssClass = section.id === selectedSectionId && item.id === selectedItemId
      ? 'selected'
      : '';

    const url = `/docs/${selectedCatId}/${section.id}/${item.id}`;

    return (
      <li key={item.id}>
        <a className={cssClass} href={url}>{item.title}</a>
      </li>
    );
  }

  renderNavSections(section) {
    return (
      <div key={section.id}>
        <h3>{section.heading}</h3>
        <ul>
          {section.items.map(this.renderNavItem.bind(this, section))}
        </ul>
      </div>
    );
  }

  render() {
    const { sections } = this.props;

    return (
      <div id="nav">
        {sections.map(this.renderNavSections.bind(this))}
      </div>
    );
  }
}

Nav.propTypes = {
  selectedCatId: PropTypes.string,
  sections: PropTypes.array,
  selectedItem: PropTypes.string,
  prefix: PropTypes.string,
};

export default Nav;
