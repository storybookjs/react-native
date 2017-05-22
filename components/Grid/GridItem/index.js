import React from 'react';
import './style.css';

export default ({ title, description, source, demo, site, thumbnail }) => (
  <div className="grid-item">
    <div className="photobox" style={{ backgroundImage: `url(${thumbnail})` }}>
      <div className="overlay" />
      <a target="_blank" className="demo" href={demo}>Demo</a>
    </div>
    <div className="text">
      <h2>{title}</h2>
      <p className="desc">{description}</p>
    </div>
  </div>
);
