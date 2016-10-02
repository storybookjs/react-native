import React, { Component, PropTypes } from 'react';

import Item from './Item';

const styles = {
  container: {
    fontFamily: '-apple-system, ".SFNSText-Regular", "San Francisco", Roboto, "Segoe UI", "Helvetica Neue", "Lucida Grande", sans-serif',
    fontSize: '12px',
  },
  empty: {
    fontFamily: '-apple-system, ".SFNSText-Regular", "San Francisco", Roboto, "Segoe UI", "Helvetica Neue", "Lucida Grande", sans-serif',
    fontSize: '11px',
    padding: '20px 12px',
    width: '100%',
    display: 'block',
    textAlign: 'center',
    textTransform: 'uppercase',
  }
}

function Report({ items, empty, passes }) {
  if (items.length) {
    return (
      <div style={styles.container}>
        {items.map((item) => (
          <Item
            passes={passes}
            item={item}
            key={item.id}
          />
        ))}
      </div>
    );
  }

  return (<span style={styles.empty}>{empty}</span>)
}

Report.propTypes = {
  items: PropTypes.array,
  empty: PropTypes.string,
}

export default Report;
