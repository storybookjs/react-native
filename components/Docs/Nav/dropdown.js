import PropTypes from 'prop-types';
import React from 'react';
import { browserHistory } from 'react-router';
import './style.css';

class Nav extends React.Component {
  renderHeadingOpts(section) {
    return <option value={section.id} key={section.id}>{section.heading}</option>;
  }

  renderNavOpts(nav) {
    return <option value={nav.id} key={nav.id}>{nav.title}</option>;
  }

  changeRoute(selectedCatId, selectedSectionId, selectedItemId) {
    const url = `/docs/${selectedCatId}/${selectedSectionId}/${selectedItemId}/`;
    browserHistory.push(url);
  }

  handleHeadingChange(evt) {
    const { selectedCatId, sections } = this.props;
    const selectedSectionId = evt.target.value;
    const section = sections.find(section => section.id === selectedSectionId);
    const itemId = section.items[0].id;
    this.changeRoute(selectedCatId, selectedSectionId, itemId);
  }

  handleNavChange(evt) {
    const { selectedCatId, sections, selectedSection } = this.props;
    const selectedSectionId = selectedSection || sections[0].id;
    this.changeRoute(selectedCatId, selectedSectionId, evt.target.value);
  }

  render() {
    const { sections, selectedSection, selectedItem } = this.props;
    const selectedSectionId = selectedSection || sections[0].id;
    const selectedItemId = selectedItem || sections[0].items[0].id;

    const selectedSectionData = sections.find(section => section.id === selectedSectionId);
    const navs = selectedSectionData.items;

    return (
      <div>
        <div>
          <select value={selectedSectionId} onChange={this.handleHeadingChange.bind(this)}>
            {sections.map(this.renderHeadingOpts.bind(this))}
          </select>
        </div>

        <div>
          <select value={selectedItemId} onChange={this.handleNavChange.bind(this)}>
            {navs.map(this.renderNavOpts.bind(this))}
          </select>
        </div>
      </div>
    );
  }
}

Nav.propTypes = {
  selectedCatId: PropTypes.string,
  sections: PropTypes.array,
  selectedSection: PropTypes.string,
  selectedItem: PropTypes.string,
};

export default Nav;
