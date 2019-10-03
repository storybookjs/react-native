import React from 'react';
import './style.css';

const Platform = () => (
  <div id="platform" className="row">
    <div className="col-md-12">
      <h3 className="built-for">Built for</h3>
      <p className="platforms">
        <a
          href="https://github.com/storybookjs/storybook/tree/master/app/react"
          target="_blank"
          rel="noopener noreferrer"
        >
          React
        </a>
        &nbsp;&amp;&nbsp;
        <a
          href="https://github.com/storybookjs/storybook/tree/master/app/react-native"
          target="_blank"
          rel="noopener noreferrer"
        >
          React Native
        </a>
      </p>
      <hr />
    </div>
  </div>
);

export default Platform;
