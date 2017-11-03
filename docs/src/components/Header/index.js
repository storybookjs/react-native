import PropTypes from 'prop-types';
import React from 'react';
import Link from 'gatsby-link';
import './style.css';

import storybookLogo from '../../design/homepage/storybook-logo.svg';

const sections = [
  { id: 'home', caption: 'Home', href: '/' },
  { id: 'docs', caption: 'Docs', href: '/basics/introduction/' },
  { id: 'examples', caption: 'Examples', href: '/examples/' },
];

class Header extends React.Component {
  renderSections() {
    return sections.map(section => {
      const { currentSection } = this.props;
      const className = currentSection === section.id ? 'selected' : '';

      return (
        <Link className={className} key={section.href} to={section.href}>
          {section.caption}
        </Link>
      );
    });
  }

  render() {
    const { currentSection } = this.props;
    let titleClassname = 'pull-left';
    if (currentSection === 'home') {
      titleClassname += ' hide';
    }

    return (
      <div id="header" className="row">
        <div className="col-xs-12">
          <div id="header-title" className={titleClassname}>
            <Link to="/">
              <img className="sb-title" src={storybookLogo} alt="Storybook Logo" />
            </Link>
          </div>
          <div id="header-links" className="pull-right">
            {this.renderSections()}
          </div>
        </div>
      </div>
    );
  }
}

Header.propTypes = {
  currentSection: PropTypes.string.isRequired,
};

export default Header;
