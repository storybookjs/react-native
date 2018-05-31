import PropTypes from 'prop-types';
import React from 'react';
import styled from 'react-emotion';

const Select = styled('select')({
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
});

class SelectType extends React.Component {
  renderOptionList({ options }) {
    if (Array.isArray(options)) {
      return options.map(val => this.renderOption(val, val));
    }
    return Object.keys(options).map(key => this.renderOption(key, options[key]));
  }

  renderOption(key, value) {
    const opts = { key, value };

    return <option {...opts}>{key}</option>;
  }

  render() {
    const { knob, onChange } = this.props;

    return (
      <Select id={knob.name} value={knob.value} onChange={e => onChange(e.target.value)}>
        {this.renderOptionList(knob)}
      </Select>
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
  }),
  onChange: PropTypes.func,
};

SelectType.serialize = value => value;
SelectType.deserialize = value => value;

export default SelectType;
