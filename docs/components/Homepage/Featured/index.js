import React from 'react';
import PropTypes from 'prop-types';
import './style.css';

const Item = ({ storybook, owner, source }) => (
  <div className="ft-sbooks col-xs-6 col-md-4" key={storybook.link}>
    <div className="col-md-4">
      <a href={storybook.link} target="_blank" rel="noopener noreferrer">
        <center>
          <img className="ft-logo" src={owner} alt="" />
        </center>
      </a>
    </div>
    <div className="desc col-md-8">
      <p>
        <a href={storybook.link} className="reponame">
          {storybook.name}
        </a>
      </p>
      <a href={source} target="_blank" rel="noopener noreferrer">
        source
      </a>
    </div>
  </div>
);
Item.propTypes = {
  storybook: PropTypes.object.isRequired, // eslint-disable-line
  owner: PropTypes.string.isRequired,
  source: PropTypes.string.isRequired,
};

const Featured = ({ featuredStorybooks }) => (
  <div id="featured" className="row">
    <div className="col-xs-12">
      <h2>Featured Storybooks</h2>
      <div className="row">{featuredStorybooks.map(item => <Item {...item} />)}</div>
      <hr />
    </div>
  </div>
);

Featured.propTypes = {
  featuredStorybooks: PropTypes.array, // eslint-disable-line
};

export default Featured;
