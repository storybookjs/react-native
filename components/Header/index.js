import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router'
import { Container, Grid, Span } from 'react-responsive-grid'
import { prefixLink } from 'gatsby-helpers'
import includes from 'underscore.string/include'

import { rhythm, adjustFontSizeTo } from 'utils/typography'
import { colors, activeColors } from 'utils/colors'
import { config } from 'config'

import storybookLogo from '../../design/homepage/storybook-logo.png';
import './style.css';

const Header = ({ location }) => {
  const homeActive = location.pathname === prefixLink('/')
  const docsActive = includes(location.pathname, '/docs/')
  const examplesActive = includes(location.pathname, '/examples/')

  return (
    <div
      style={{
        background: colors.bg,
        color: colors.fg,
        marginBottom: rhythm(1.5),
      }}
    >
      <Container
        style={{
          maxWidth: 960,
          paddingLeft: rhythm(3/4),
        }}
      >
        <Grid
          columns={12}
          style={{
            padding: `${rhythm(3/4)} 0`,
          }}
        >
          <Span
            columns={4}
            style={{
              height: 24, // Ugly hack. How better to constrain height of div?
            }}
          >
          {
            homeActive
            ? null
            : (
              <Link
                to={prefixLink('/')}
                style={{
                  textDecoration: 'none',
                  color: colors.fg,
                  fontSize: adjustFontSizeTo('25.5px').fontSize,
                }}
              >
                <img className="sb-title" src={storybookLogo} alt="Storybook Logo" />
              </Link>
            )
          }
          </Span>
          <Span columns={8} last>
            <a
              style={{
                float: 'right',
                color: colors.fg,
                textDecoration: 'none',
                marginLeft: rhythm(1/2),
              }}
              href="https://github.com/storybooks/storybook"
            >
              Github
            </a>
            <Link
              to={prefixLink('/examples/')}
              style={{
                background: examplesActive ? activeColors.bg : colors.bg,
                color: examplesActive ? activeColors.fg : colors.fg,
                float: 'right',
                textDecoration: 'none',
                paddingLeft: rhythm(1/2),
                paddingRight: rhythm(1/2),
                paddingBottom: rhythm(3/4),
                marginBottom: rhythm(-1),
                paddingTop: rhythm(1),
                marginTop: rhythm(-1),
              }}
            >
              Examples
            </Link>
            <Link
              to={prefixLink('/docs/react-storybook/basics/introduction/')}
              style={{
                background: docsActive ? activeColors.bg : colors.bg,
                color: docsActive ? activeColors.fg : colors.fg,
                float: 'right',
                textDecoration: 'none',
                paddingLeft: rhythm(1/2),
                paddingRight: rhythm(1/2),
                paddingBottom: rhythm(3/4),
                marginBottom: rhythm(-1),
                paddingTop: rhythm(1),
                marginTop: rhythm(-1),
              }}
            >
              Docs
            </Link>
          </Span>
        </Grid>
      </Container>
    </div>
  )
}

Header.propTypes = {
  location: PropTypes.object,
}

export default Header

// const sections = [
//   { id: 'home', caption: 'Home', href: '/' },
//   { id: 'docs', caption: 'Docs', href: '/docs' },
// ];
//
// class Header extends React.Component {
//   renderSections() {
//     return sections.map(section => {
//       const { currentSection } = this.props;
//       const className = currentSection === section.id ? 'selected' : '';
//
//       return (
//         <a className={className} key={section.href} href={section.href}>
//           {section.caption}
//         </a>
//       );
//     });
//   }
//
//   render() {
//     const { currentSection } = this.props;
//     let titleClassname = 'pull-left';
//     if (currentSection === 'home') {
//       titleClassname += ' hide';
//     }
//
//     return (
//       <div id="header" className="row">
//         <div className="col-xs-12">
//           <div id="header-title" className={titleClassname}>
//             <a href="/">
//             </a>
//           </div>
//           <div id="header-links" className="pull-right">
//             {this.renderSections()}
//           </div>
//         </div>
//       </div>
//     );
//   }
// }
//
// Header.propTypes = {
//   currentSection: PropTypes.string,
// };
//
// export default Header;
