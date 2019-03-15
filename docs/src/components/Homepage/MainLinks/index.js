import React from 'react';
import Link from 'gatsby-link';
import { window } from 'global';

import '../../Docs/Nav/style.css';
import { UsedByBg } from '../UsedBy';
import './style.css';

class MainLinks extends React.Component {
  componentDidMount() {
    window.docsearch({
      apiKey: 'a4f7f972f1d8f99a66e237e7fd2e489f',
      indexName: 'storybook-js',
      inputSelector: '#search',
      debug: false, // Set debug to true if you want to inspect the dropdown
    });
  }

  render() {
    return (
      <div id="main-links">
        <div className="main-links-container">
          <div className="try-now">
            <h2>Try Now</h2>
            <pre>
              <code>
                cd my-react-vue-angular-app
                <br />
                npx -p @storybook/cli sb init
                <br />
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
            <div className="col-xs-12 col-sm-12 read-docs">
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
                <span
                  className="form-control-feedback"
                  role="img"
                  aria-hidden="true"
                  aria-label="magnifying glass"
                >
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
                  <Link to="/guides/quick-start-guide/">Quick setup</Link>
                </li>
                <li>
                  <Link to="/guides/slow-start-guide/">Adding to existing project</Link>
                </li>
                <li>
                  <Link to="/basics/writing-stories/">Writing stories</Link>
                </li>
                <li>
                  <Link to="/basics/live-examples/">Live Examples</Link>
                </li>
              </ul>
            </div>

            <div className="col-sm-4 read-docs">
              <Link to="/configurations/default-config/">
                <h3>Configuration</h3>
              </Link>
              <ul>
                <li>
                  <Link to="/configurations/options-parameter/">Storybook options</Link>
                </li>
                <li>
                  <Link to="/configurations/custom-babel-config/">Babel configurations</Link>
                </li>
                <li>
                  <Link to="/configurations/custom-webpack-config/">Webpack configurations</Link>
                </li>
                <li>
                  <Link to="/configurations/typescript-config/">Typescript configurations</Link>
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
                  <Link to="/addons/writing-addons/">Writing Addons</Link>
                </li>
                <li>
                  <Link to="/addons/api/">Api</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MainLinks;
