import React from 'react';
import demoImg from './images/storybook-intro.gif';
import './style.css';

const Demo = () => (
  <div id="demo" className="row">
    <div className="col-xs-12">
      <center>
        <img className="demo-img" src={demoImg} alt="" />
      </center>
    </div>
  </div>
);

export default Demo;
