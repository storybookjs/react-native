import PropTypes from 'prop-types';
import React from 'react';
import './style.css';

class Featured extends React.Component {
  renderFeaturedItem(ftItem) {
    return (
      <div className="ft-sbooks col-xs-6 col-md-4" key={ftItem.storybook.link}>
        <div className="col-md-4">
          <a href={ftItem.storybook.link} target="_blank">
            <center>
              <img className="ft-logo" src={ftItem.owner} role="presentation" />
            </center>
          </a>
        </div>
        <div className="desc col-md-8">
          <p>
            <a href={ftItem.storybook.link} className="reponame">
              {ftItem.storybook.name}
            </a>
          </p>
          <a href={ftItem.source} target="_blank">source</a>
        </div>
      </div>
    );
  }

  render() {
    const { featuredStorybooks } = this.props;
    return (
      <div id="featured" className="row">
        <div className="col-xs-12">
          <h2>Featured Storybooks</h2>
          <div className="row">
            {featuredStorybooks.map(this.renderFeaturedItem.bind(this))}
          </div>
          <hr />
        </div>
      </div>
    );
  }
}

Featured.propTypes = {
  featuredStorybooks: PropTypes.array,
};

export default Featured;
