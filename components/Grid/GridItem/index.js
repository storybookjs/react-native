import React from 'react';
import './style.css';

const linkProps = {
  rel: 'nofollow',
  target: '_blank',
  className: 'link',
};

export default ({ title, description, source, demo, site, thumbnail }) => (
  <div className="grid-item">
    <div className="photobox" style={{ backgroundImage: `url(${thumbnail})` }}>
      <div className="overlay" />
    </div>
    <div className="text">
      <h2>{title}</h2>
      <p className="desc">{description}</p>
      <div className="button-row">
        {demo ? <a href={demo} {...linkProps}>Demo</a> : null}
        {source ? <a href={source} {...linkProps}>Source</a> : null}
      </div>
    </div>
  </div>
);
