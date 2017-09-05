import React from 'react';
import PropTypes from 'prop-types';
import './style.css';

const linkProps = {
  rel: 'nofollow nofollower noreferrer',
  target: '_blank',
  className: 'link',
};

const GridItem = ({ title, description, source, demo, thumbnail }) => (
  <div className="grid-item">
    <div className="photobox" style={{ backgroundImage: `url(${thumbnail})` }}>
      <div className="overlay" />
    </div>
    <div className="text">
      <h2>{title}</h2>
      <p className="desc">{description}</p>
      <div className="button-row">
        {demo ? (
          <a href={demo} {...linkProps}>
            Demo
          </a>
        ) : null}
        {source ? (
          <a href={source} {...linkProps}>
            Source
          </a>
        ) : null}
      </div>
    </div>
  </div>
);
GridItem.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  thumbnail: PropTypes.string.isRequired,
  source: PropTypes.string,
  demo: PropTypes.string,
};
GridItem.defaultProps = {
  source: '',
  demo: '',
};

export { GridItem as default };
