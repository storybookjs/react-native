/* eslint no-underscore-dangle: 0 */

import PropTypes from 'prop-types';
import React from 'react';

const styles = {
  display: 'table-cell',
  boxSizing: 'border-box',
  verticalAlign: 'middle',
  height: '26px',
  width: '100%',
  outline: 'none',
  border: '1px solid #f7f4f4',
  borderRadius: 2,
  fontSize: 11,
  padding: '5px',
  color: '#555',
};

class SelectType extends React.Component {
  _makeOpt(key, value, selectV2) {
    const opts = {
      key,
      value: key,
    };

    let display = value;

    if (selectV2) {
      opts.value = value;
      display = key;
    }

    return <option {...opts}>{display}</option>;
  }
  _options({ options, selectV2 }) {
    let data = [];
    if (Array.isArray(options)) {
      data = options.map(val => this._makeOpt(val, val));
    } else {
      data = Object.keys(options).map(key => this._makeOpt(key, options[key], selectV2));
    }

    return data;
  }
  render() {
    const { knob, onChange } = this.props;

    return (
      <select
        id={knob.name}
        ref={c => {
          this.input = c;
        }}
        style={styles}
        value={knob.value}
        onChange={e => onChange(e.target.value)}
      >
        {this._options(knob)}
      </select>
    );
  }
}

SelectType.defaultProps = {
  knob: {},
  onChange: value => value,
};

SelectType.propTypes = {
  knob: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.string,
    options: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    selectV2: PropTypes.bool,
  }),
  onChange: PropTypes.func,
};

SelectType.serialize = value => value;
SelectType.deserialize = value => value;

export default SelectType;
