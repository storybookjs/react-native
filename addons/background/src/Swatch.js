import React from 'react';
import PropTypes from 'prop-types';

const style = {
  swatches: {
    backgroundColor: '#fff',
    textAlign: 'center',
    padding: '0',
    border: '1px solid rgba(0,0,0,0.1)',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'inline-block',
    width: '175px',
    verticalAlign: 'top',
    wordWrap: 'break-word',
  },
  swatch: {
    height: '80px',
    borderRadius: '4px 4px 0 0',
    transition: 'opacity 0.25s ease-in-out',
    borderBottom: '1px solid rgba(0,0,0,0.1)',
  },
  listStyle: { listStyle: 'none' },
  pushBottom: { marginBottom: '10px' },
  pushLeft: { marginLeft: '10px' },
  soft: { paddingLeft: '10px', paddingRight: '10px' },
  hard: { padding: '0' },
  flush: { margin: '0' },
  font: {
    fontFamily:
      "-apple-system, '.SFNSText-Regular', 'San Francisco', Roboto, 'Segoe UI', 'Helvetica Neue', 'Lucida Grande', sans-serif",
    fontSize: '14px',
    wordBreak: 'break-word',
  },
};

const Swatch = ({ name, value, setBackground }) => (
  <button
    style={Object.assign({}, style.swatches, style.listStyle, style.hard)}
    onClick={() => setBackground(value)}
    // Prevent focusing on mousedown
    onMouseDown={event => event.preventDefault()}
  >
    <div
      style={Object.assign({}, style.swatch, {
        background: value,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      })}
    />
    <div style={Object.assign({}, style.listStyle, style.soft)}>
      <h4 style={Object.assign({ float: 'left', fontWeight: 'bold' }, style.font)}>{name}:</h4>
      <h4 style={Object.assign({ float: 'right', fontWeight: 'normal' }, style.font)}>
        <em>{value}</em>
      </h4>
    </div>
  </button>
);
Swatch.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  setBackground: PropTypes.func.isRequired,
};

export default Swatch;
