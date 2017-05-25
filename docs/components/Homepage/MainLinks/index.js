import React from 'react';
import { Link } from 'react-router';
import './style.css';

const MainLinks = () => (
  <div id="main-links" className="row">
    <div className="col-md-12">
      <div className="row">
        <div className="main-links-container">
          <div className="col-xs-6 try-now">
            <h2>Try Now</h2>
            <pre>
              <code>
                npm i -g getstorybook<br />
                cd my-react-app<br />
                getstorybook<br />
              </code>
            </pre>
          </div>

          <div className="col-xs-6 read-docs">
            <h2>Read Docs</h2>
            <center>
              <Link to="/docs/react-storybook/basics/introduction/">
                <div className="docs-img" />
              </Link>
            </center>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default MainLinks;
