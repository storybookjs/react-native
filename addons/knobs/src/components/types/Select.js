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
  constructor(props, context) {
    super(props, context);

    if (!props.knob.selectV2) {
      console.info('Select Knob V1 will be deprecated, please upgrade to V2 of Select Knob'); // eslint-disable-line no-console
    }
  }

  renderOptionList({ options, selectV2 }) {
    if (Array.isArray(options)) {
      return options.map(val => this.renderOption(val, val));
    }
    return Object.keys(options).map(key => this.renderOption(key, options[key], selectV2));
  }

  renderOption(key, value, selectV2) {
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

  render() {
    const { knob, onChange } = this.props;

    return (
      <select
        id={knob.name}
        style={styles}
        value={knob.value}
        onChange={e => onChange(e.target.value)}
      >
        {this.renderOptionList(knob)}
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
