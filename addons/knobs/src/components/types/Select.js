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
  _makeOpt(key, val) {
    const opts = {
      key,
      value: key,
    };

    return <option {...opts}>{val}</option>;
  }
  _options(values) {
    let data = [];
    if (Array.isArray(values)) {
      data = values.map(val => this._makeOpt(val, val));
    } else {
      data = Object.keys(values).map(key => this._makeOpt(key, values[key]));
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
        {this._options(knob.options)}
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
  }),
  onChange: PropTypes.func,
};

SelectType.serialize = value => value;
SelectType.deserialize = value => value;

export default SelectType;
