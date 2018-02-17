import React from 'react';
import Link from 'gatsby-link';
import githubIcon from './images/github-icon.png';
import './style.css';

const Footer = () => (
  <div id="footer" className="row">
    <div className="col-md-12">
      <div className="row logos">
        <div className="col-xs-12">
          <center>
            Maintained by the <Link to="/basics/community/">Storybook Community</Link>
            .
          </center>
          <center>
            <a
              href="https://github.com/storybooks/storybook"
              target="_blank"
              rel="noreferrer noopener"
            >
              <img src={githubIcon} alt="Storybook GitHub" style={{ padding: '7px' }} />
            </a>
          </center>
        </div>
      </div>
    </div>
  </div>
);

export default Footer;
