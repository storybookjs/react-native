import React from 'react';
import PropTypes from 'prop-types';
import addons from '@storybook/addons';

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
  rerunButtonContainer: {
    textAlign: 'center',
    margin: 10,
  },
  rerunButton: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    border: '1px solid rgb(193, 193, 193)',
    borderRadius: 2,
    padding: 5,
  },
};

function RerunButton() {
  function onRerunClick() {
    const channel = addons.getChannel();
    channel.emit('addon:a11y:rerun');
  }
  return (
    <div style={styles.rerunButtonContainer}>
      <button onClick={onRerunClick} style={styles.rerunButton}>
        Re-run tests
      </button>
    </div>
  );
}

function Report({ items, empty, passes }) {
  if (items.length) {
    return (
      <div>
        <div style={styles.container}>
          {items.map(item => <Item passes={passes} item={item} key={item.id} />)}
        </div>
        <RerunButton />
      </div>
    );
  }

  return (
    <div>
      <span style={styles.empty}>{empty}</span>
      <RerunButton />
    </div>
  );
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
