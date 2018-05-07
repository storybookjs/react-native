import React from 'react';
import PropTypes from 'prop-types';
import addons from '@storybook/addons';

import { RERUN_EVENT_ID } from '../../shared';

import RerunButton from './RerunButton';
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

function onRerunClick() {
  const channel = addons.getChannel();
  channel.emit(RERUN_EVENT_ID);
}

const Report = ({ items, empty, passes }) => (
  <div>
    {items.length ? (
      <div style={styles.container}>
        {items.map(item => <Item passes={passes} item={item} key={item.id} />)}
      </div>
    ) : (
      <span style={styles.empty}>{empty}</span>
    )}
    <RerunButton onClick={onRerunClick}>Re-run tests</RerunButton>
  </div>
);

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
