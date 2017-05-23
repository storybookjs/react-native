import React from 'react';
import './style.css';

export default ({ title, description, source, demo, site, thumbnail }) => (
  <div className="grid-item">
    <div className="photobox" style={{ backgroundImage: `url(${thumbnail})` }}>
      <div className="overlay" />
    </div>
    <div className="text">
      <h2>{title}</h2>
      <p className="desc">{description}</p>
      <div className="button-row">
        {demo ? <a target="_blank" className="link" href={demo}>Demo</a> : null}
        {source ? <a target="_blank" className="link" href={source}>Source</a> : null}
      </div>
    </div>
  </div>
);
