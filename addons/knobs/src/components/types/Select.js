import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Select } from '@storybook/components';

class SelectType extends Component {
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
      <Select value={knob.value} onChange={e => onChange(e.target.value)} size="flex">
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
    value: PropTypes.any,
    options: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  }),
  onChange: PropTypes.func,
};

SelectType.serialize = value => value;
SelectType.deserialize = value => value;

export default SelectType;
