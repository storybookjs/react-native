import React from 'react';
import { Link } from 'react-router';
import slackIcon from './images/slack-icon.png';
import githubIcon from './images/github-icon.png';
import './style.css';

const Footer = () =>
  <div id="footer" className="row">
    <div className="col-md-12">
      <div className="row logos">
        <div className="col-xs-12">
          <center>
            Maintained by the <Link to="/basics/community/">Storybook Community</Link>
            .
          </center>
          <center>
            <Link to="https://now-examples-slackin-nqnzoygycp.now.sh/" target="_blank">
              <img src={slackIcon} alt="Storybook Slack" />
            </Link>
            <Link to="https://github.com/storybooks/storybook" target="_blank">
              <img src={githubIcon} alt="Storybook GitHub" style={{ padding: '7px' }} />
            </Link>
          </center>
        </div>
      </div>
    </div>
  </div>;

export default Footer;
