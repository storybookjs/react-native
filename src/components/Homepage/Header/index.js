import React from 'react';
import './style.css';

import storybookLogo from '../../../design/homepage/storybook-logo.png';

const sections = [
  { id: 'home', caption: 'Home', href: '/' },
  { id: 'docs', caption: 'Docs', href: '/docs' },
];

class Header extends React.Component {
  renderSections() {
    return sections.map((section) => {
      const { currentSection } = this.props;
      const className = currentSection === section.id ? 'selected' : '';

      return (
        <a
          className={className}
          key={section.href}
          href={section.href}
        >
          {section.caption}
        </a>
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
            <a href="/">
              <img className="sb-title" src={storybookLogo} alt="Storybook Logo"/>
            </a>
          </div>
          <div id="header-links" className="pull-right">
            { this.renderSections() }
            <a href="https://storybooks.io">Storybooks.io</a>
          </div>
        </div>
      </div>
    );
  }
}

Header.propTypes = {
  currentSection: React.PropTypes.string,
};

export default Header;
