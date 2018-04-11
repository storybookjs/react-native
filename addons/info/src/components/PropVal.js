import React from 'react';
import PropTypes from 'prop-types';
import { withTheme } from 'glamorous';
import createFragment from 'react-addons-create-fragment';

const getValueStyles = (codeColors = {}) => ({
  func: {
    color: codeColors.func || '#170',
  },

  attr: {
    color: codeColors.attr || '#666',
  },

  object: {
    color: codeColors.object || '#666',
  },

  array: {
    color: codeColors.array || '#666',
  },

  number: {
    color: codeColors.number || '#a11',
  },

  string: {
    color: codeColors.string || '#22a',
    wordBreak: 'break-word',
  },

  bool: {
    color: codeColors.bool || '#a11',
  },

  empty: {
    color: '#777',
  },
});

function previewArray(val, maxPropArrayLength, valueStyles) {
  const items = {};
  val.slice(0, maxPropArrayLength).forEach((item, i) => {
    items[`n${i}`] = <PropVal val={item} valueStyles={valueStyles} />;
    items[`c${i}`] = ', ';
  });
  if (val.length > maxPropArrayLength) {
    items.last = '…';
  } else {
    delete items[`c${val.length - 1}`];
  }
  return <span style={valueStyles.array}>[{createFragment(items)}]</span>;
}

function previewObject(val, maxPropObjectKeys, valueStyles) {
  const names = Object.keys(val);
  const items = {};
  names.slice(0, maxPropObjectKeys).forEach((name, i) => {
    items[`k${i}`] = <span style={valueStyles.attr}>{name}</span>;
    items[`c${i}`] = ': ';
    items[`v${i}`] = <PropVal val={val[name]} valueStyles={valueStyles} />;
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

function PropVal(props) {
  const { maxPropObjectKeys, maxPropArrayLength, maxPropStringLength, theme } = props;
  let { val } = props;
  const { codeColors } = theme || {};
  let braceWrap = true;
  let content = null;
  const valueStyles = props.valueStyles || getValueStyles(codeColors);

  if (typeof val === 'number') {
    content = <span style={valueStyles.number}>{val}</span>;
  } else if (typeof val === 'string') {
    if (val.length > maxPropStringLength) {
      val = `${val.slice(0, maxPropStringLength)}…`;
    }
    content = <span style={valueStyles.string}>{val}</span>;
    braceWrap = false;
  } else if (typeof val === 'boolean') {
    content = <span style={valueStyles.bool}>{`${val}`}</span>;
  } else if (Array.isArray(val)) {
    content = previewArray(val, maxPropArrayLength, valueStyles);
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
    content = previewObject(val, maxPropObjectKeys, valueStyles);
  }

  if (!braceWrap) return content;

  return <span>&#123;{content}&#125;</span>;
}

PropVal.defaultProps = {
  val: null,
  maxPropObjectKeys: 3,
  maxPropArrayLength: 3,
  maxPropStringLength: 50,
  theme: {},
  valueStyles: null,
};

PropVal.propTypes = {
  val: PropTypes.any, // eslint-disable-line
  maxPropObjectKeys: PropTypes.number,
  maxPropArrayLength: PropTypes.number,
  maxPropStringLength: PropTypes.number,
  theme: PropTypes.shape({
    codeColors: PropTypes.object,
  }),
  valueStyles: PropTypes.shape({
    func: PropTypes.object,
    attr: PropTypes.object,
    object: PropTypes.object,
    array: PropTypes.object,
    number: PropTypes.object,
    string: PropTypes.object,
    bool: PropTypes.object,
    empty: PropTypes.object,
  }),
};

export default withTheme(PropVal);
