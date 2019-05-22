import React from 'react';
import slackIcon from './images/slack-icon.png';
import githubIcon from './images/github-icon.png';
import './style.css';

const Footer = () => (
  <div id="footer" className="row">
    <div className="col-md-12">
      <div className="logos">
        <div className="col-xs-12">
          <center>
            Maintained by the <a href="https://storybook.js.org/community/">Storybook Community</a>.
          </center>
          <center>
            <a
              href="https://now-examples-slackin-nqnzoygycp.now.sh/"
              target="_blank"
              rel="noreferrer noopener"
            >
              <img src={slackIcon} alt="Storybook Slack" />
            </a>
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
