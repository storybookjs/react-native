import React from 'react';
import PropTypes from 'prop-types';

import Item from './Item';

const styles = {
  container: {
    fontSize: '12px',
  },
  empty: {
    fontSize: '11px',
    padding: '20px 12px',
    width: '100%',
    display: 'block',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
};

function Report({ items, empty, passes }) {
  if (items.length) {
    return (
      <div style={styles.container}>
        {items.map(item => <Item passes={passes} item={item} key={item.id} />)}
      </div>
    );
  }

  return <span style={styles.empty}>{empty}</span>;
}

Report.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      nodes: PropTypes.array,
      tags: PropTypes.array,
    })
  ).isRequired,
  empty: PropTypes.string.isRequired,
  passes: PropTypes.bool.isRequired,
};

export default Report;
