import React from 'react';
import PropTypes from 'prop-types';

const styles = {
  info: {
    backgroundColor: 'rgb(234, 234, 234)',
    padding: '12px',
    marginBottom: '10px',
  },
  help: {
    margin: '0 0 12px',
  },
  helpUrl: {
    marginTop: '12px',
    textDecoration: 'underline',
    color: 'rgb(130, 130, 130)',
    display: 'block',
  },
};

function Info({ item }) {
  return (
    <div style={styles.info}>
      <p style={styles.help}>{item.help}</p>
      <a style={styles.helpUrl} href={item.helpUrl} target="_blank">
        More info...
      </a>
    </div>
  );
}

Info.propTypes = {
  item: PropTypes.shape({
    help: PropTypes.node,
    helpUrl: PropTypes.string,
  }).isRequired,
};

export default Info;
