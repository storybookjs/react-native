import React from 'react';
import './style.css';

class Nav extends React.Component {
  renderNavItem(section, item) {
    const { selectedSectionId, selectedItemId } = this.props;
    const cssClass = (
      section.id === selectedSectionId &&
      item.id === selectedItemId
    ) ? "selected" : '';

    const url = `/docs/${section.id}/${item.id}`;

    return (
      <li key={ item.id }>
        <a className={ cssClass } href={url}>{item.title}</a>
      </li>
    );
  }

  renderNavSections(section) {
    return (
      <div key={ section.id }>
        <h3>{ section.heading }</h3>
        <ul>
          { section.items.map(this.renderNavItem.bind(this, section)) }
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
  sections: React.PropTypes.array,
  selectedItem: React.PropTypes.string,
  prefix: React.PropTypes.string,
};

export default Nav;
