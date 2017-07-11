import React from 'react';
import { Link } from 'react-router';
import { UsedByBg } from '../UsedBy/';
import './style.css';

const MainLinks = () =>
  <div id="main-links">
    <div className="main-links-container">
      <div className="try-now">
        <h2>Try Now</h2>
        <pre>
          <code>
            npm i -g @storybook/cli<br />
            cd my-react-app<br />
            getstorybook<br />
          </code>
        </pre>
      </div>

      <div
        className="row"
        id="nav"
        style={{
          borderRight: '0 none',
          position: 'relative',
        }}
      >
        <UsedByBg
          color="#a7d0ff"
          style={{
            transform: 'rotateY(180deg)',
          }}
        />
        <div className="col-xs-12 read-docs">
          <h2 style={{ color: '#6DABF5' }}>Documentation</h2>
          <div
            className="form-group has-feedback"
            style={{ maxWidth: '450px', margin: '20px auto' }}
          >
            <label className="sr-only control-label" htmlFor="search">
              Search storybook documentation
            </label>
            <input
              className="form-control"
              type="search"
              id="search"
              placeholder="type to search"
            />
            <span className="form-control-feedback" aria-hidden="true">
              🔍
            </span>
          </div>
        </div>

        <div className="col-sm-4 read-docs">
          <Link to="/basics/introduction/">
            <h3>Basics</h3>
          </Link>
          <ul>
            <li>
              <Link to="/basics/quick-start-guide/">Quick setup</Link>
            </li>
            <li>
              <Link to="/basics/slow-start-guide/">Adding to existing project</Link>
            </li>
            <li>
              <Link to="/basics/writing-stories/">Writing stories</Link>
            </li>
          </ul>
        </div>

        <div className="col-sm-4 read-docs">
          <Link to="/configurations/default-config/">
            <h3>Configuration</h3>
          </Link>
          <ul>
            <li>
              <Link to="/configurations/custom-babel-config/">Babel configurations</Link>
            </li>
            <li>
              <Link to="/configurations/custom-webpack-config/">Webpack configurations</Link>
            </li>
            <li>
              <Link to="/configurations/add-custom-head-tags/">Custom scripts & styling</Link>
            </li>
            <li>
              <Link to="/configurations/serving-static-files/">Serving static files</Link>
            </li>
          </ul>
        </div>

        <div className="col-sm-4 read-docs">
          <Link to="/configurations/default-config/">
            <h3>Addons</h3>
          </Link>
          <ul>
            <li>
              <Link to="/addons/introduction/">Intro to Addons</Link>
            </li>
            <li>
              <Link to="/addons/using-addons/">Using Addons</Link>
            </li>
            <li>
              <Link to="/addons/addon-gallery/">Addon Gallery</Link>
            </li>
            <li>
              <Link to="/addons/writing-addons/">Writing Addons</Link>
            </li>
            <li>
              <Link to="/addons/api/">Api</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>;

export default MainLinks;
