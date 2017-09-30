import React from 'react';
import PropTypes from 'prop-types';
import createFragment from 'react-addons-create-fragment';

const valueStyles = {
  func: {
    color: '#170',
  },

  attr: {
    color: '#666',
  },

  object: {
    color: '#666',
  },

  array: {
    color: '#666',
  },

  number: {
    color: '#a11',
  },

  string: {
    color: '#22a',
    wordBreak: 'break-word',
  },

  bool: {
    color: '#a11',
  },

  empty: {
    color: '#777',
  },
};

function previewArray(val, maxPropArrayLength) {
  const items = {};
  val.slice(0, maxPropArrayLength).forEach((item, i) => {
    items[`n${i}`] = <PropVal val={item} />;
    items[`c${i}`] = ', ';
  });
  if (val.length > maxPropArrayLength) {
    items.last = '…';
  } else {
    delete items[`c${val.length - 1}`];
  }
  return <span style={valueStyles.array}>[{createFragment(items)}]</span>;
}

function previewObject(val, maxPropObjectKeys) {
  const names = Object.keys(val);
  const items = {};
  names.slice(0, maxPropObjectKeys).forEach((name, i) => {
    items[`k${i}`] = <span style={valueStyles.attr}>{name}</span>;
    items[`c${i}`] = ': ';
    items[`v${i}`] = <PropVal val={val[name]} />;
    items[`m${i}`] = ', ';
  });
  if (names.length > maxPropObjectKeys) {
    items.rest = '…';
  } else {
    delete items[`m${names.length - 1}`];
  }
  return (
    <span style={valueStyles.object}>
      {'{'}
      {createFragment(items)}
      {'}'}
    </span>
  );
}

export default function PropVal(props) {
  const { maxPropObjectKeys, maxPropArrayLength, maxPropStringLength } = props;
  let val = props.val;
  let braceWrap = true;
  let content = null;

  if (typeof val === 'number') {
    content = <span style={valueStyles.number}>{val}</span>;
  } else if (typeof val === 'string') {
    if (val.length > maxPropStringLength) {
      val = `${val.slice(0, maxPropStringLength)}…`;
    }
    content = <span style={valueStyles.string}>"{val}"</span>;
    braceWrap = false;
  } else if (typeof val === 'boolean') {
    content = <span style={valueStyles.bool}>{`${val}`}</span>;
  } else if (Array.isArray(val)) {
    content = previewArray(val, maxPropArrayLength);
  } else if (typeof val === 'function') {
    content = <span style={valueStyles.func}>{val.name ? `${val.name}()` : 'anonymous()'}</span>;
  } else if (!val) {
    content = <span style={valueStyles.empty}>{`${val}`}</span>;
  } else if (typeof val !== 'object') {
    content = <span>…</span>;
  } else if (React.isValidElement(val)) {
    content = (
      <span style={valueStyles.object}>
        {`<${val.type.displayName || val.type.name || val.type} />`}
      </span>
    );
  } else {
    content = previewObject(val, maxPropObjectKeys);
  }

  if (!braceWrap) return content;

  return <span>&#123;{content}&#125;</span>;
}

PropVal.defaultProps = {
  val: null,
  maxPropObjectKeys: 3,
  maxPropArrayLength: 3,
  maxPropStringLength: 50,
};

PropVal.propTypes = {
  val: PropTypes.any, // eslint-disable-line
  maxPropObjectKeys: PropTypes.number,
  maxPropArrayLength: PropTypes.number,
  maxPropStringLength: PropTypes.number,
};
