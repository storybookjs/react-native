import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import './style.css';

class Nav extends React.Component {
  renderNavItem(section, item) {
    const { selectedSectionId, selectedItemId } = this.props;
    const cssClass = section.id === selectedSectionId && item.id === selectedItemId
      ? 'selected'
      : '';

    const url = `/${section.id}/${item.id}/`;

    return (
      <li key={item.id}>
        <Link className={cssClass} to={url}>{item.title}</Link>
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
  sections: PropTypes.array,
  selectedItem: PropTypes.string,
  prefix: PropTypes.string,
};

export default Nav;
