import React from 'react';
import slackIcon from './images/slack-icon.png';
import nlIcon from './images/mail-icon.png';
import twitterIcon from './images/twitter-icon.png';
import mediumIcon from './images/medium-icon.png';
import './style.css';

const Footer = () => (
  <div id="footer" className="row">
    <div className="col-md-12">
      <div className="row logos">
        <div className="col-xs-12">
          <center>
            <a href="https://storybooks-slackin.herokuapp.com/" target="_blank">
              <img src={slackIcon} role="presentation" />
            </a>
            <a href="https://tinyletter.com/storybooks" target="_blank">
              <img src={nlIcon} role="presentation" />
            </a>
            <a href="https://twitter.com/kadirahq" target="_blank">
              <img src={twitterIcon} role="presentation" />
            </a>
            <a href="https://voice.kadira.io" target="_blank">
              <img src={mediumIcon} role="presentation" />
            </a>
          </center>
        </div>
      </div>

      <div id="copyright" className="row">
        <p>Built by Kadira</p>
      </div>
    </div>
  </div>
);

export default Footer;
