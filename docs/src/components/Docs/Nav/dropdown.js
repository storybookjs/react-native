import PropTypes from 'prop-types';
import React from 'react';
import { Redirect } from 'react-router';
import './style.css';

class Nav extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {};
  }

  handleHeadingChange(event) {
    const { sections } = this.props;
    const selectedSectionId = event.target.value;
    const section = sections.find(s => s.id === selectedSectionId);
    const itemId = section.items[0].id;
    this.changeRoute(selectedSectionId, itemId);
  }

  handleNavChange(event) {
    const { sections, selectedSection } = this.props;
    const selectedSectionId = selectedSection || sections[0].id;
    this.changeRoute(selectedSectionId, event.target.value);
  }

  changeRoute(selectedSectionId, selectedItemId) {
    const url = `/${selectedSectionId}/${selectedItemId}/`;
    this.setState({ redirect: url });
  }

  renderNavOpts(nav) {
    return (
      <option value={nav.id} key={nav.id}>
        {nav.title}
      </option>
    );
  }

  renderHeadingOpts(section) {
    return (
      <option value={section.id} key={section.id}>
        {section.heading}
      </option>
    );
  }
  render() {
    const { sections, selectedSection, selectedItem } = this.props;
    const selectedSectionId = selectedSection || sections[0].id;
    const selectedItemId = selectedItem || sections[0].items[0].id;

    const selectedSectionData = sections.find(section => section.id === selectedSectionId);
    const navs = selectedSectionData.items;

    return this.state.redirect ? (
      <Redirect to={this.state.redirect} />
    ) : (
      <div>
        <div>
          <select value={selectedSectionId} onChange={event => this.handleHeadingChange(event)}>
            {sections.map(section => this.renderHeadingOpts(section))}
          </select>
        </div>

        <div>
          <select value={selectedItemId} onChange={event => this.handleNavChange(event)}>
            {navs.map(nav => this.renderNavOpts(nav))}
          </select>
        </div>
      </div>
    );
  }
}
Nav.propTypes = {
  sections: PropTypes.array, // eslint-disable-line
  selectedSection: PropTypes.string.isRequired,
  selectedItem: PropTypes.string.isRequired,
};

export default Nav;
