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
  _makeOpt(key, val, selected) {
    const opts = {
      key,
      selected: 'selected',
      value: key,
    };
    if (selected !== key) {
      delete(opts.selected);
    }

    return <option {...opts}>{val}</option>;
  }
  _options(values, selected = '') {
    let data = [];
    if (Array.isArray(values)) {
      data = values.map(val => this._makeOpt(val, val, selected));
    } else {
      data = Object.keys(values).map(key => this._makeOpt(key, values[key], selected));
    }

    return data;
  }
  render() {
    const { knob, onChange } = this.props;

    return (
      <select
        id={knob.name}
        ref="input"
        style={styles}
        value={knob.value}
        onChange={(e) => onChange(e.target.value)}
      >
        {this._options(knob.options)}
      </select>
    );
  }
}

SelectType.propTypes = {
  knob: React.PropTypes.object,
  onChange: React.PropTypes.func,
};

SelectType.serialize = function (value) {
  return value;
};

SelectType.deserialize = function (value) {
  return value;
};

export default SelectType;
