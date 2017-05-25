import React from 'react';
import './style.css';

const Platform = () => (
  <div id="platform" className="row">
    <div className="col-md-12">
      <h3 className="built-for">Built for</h3>
      <p className="platforms">

        <a href="https://github.com/storybooks/storybook/tree/master/app/react" target="_blank">React</a>
        {' '}
        &
        {' '}
        <a href="https://github.com/storybooks/storybook/tree/master/app/react-native" target="_blank">
          React Native
        </a>
      </p>

      <hr />
    </div>
  </div>
);

export default Platform;
