import React from 'react';
import PropTypes from 'prop-types';

const styles = {
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: '12px 0',
  },
  tag: {
    margin: '0 6px',
    padding: '5px',
    border: '1px solid rgb(234, 234, 234)',
    borderRadius: '2px',
    color: 'rgb(130, 130, 130)',
    fontSize: '12px',
  },
};

function Tags({ tags }) {
  return (
    <div style={styles.tags}>
      {tags.map(tag => (
        <div key={tag} style={styles.tag}>
          {tag}
        </div>
      ))}
    </div>
  );
}
Tags.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.node).isRequired,
};

export default Tags;
