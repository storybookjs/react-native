/* eslint-disable no-underscore-dangle */

import PropTypes from 'prop-types';
import React from 'react';
import TypeMap from './types';

const InvalidType = () => <span>Invalid Type</span>;

const stylesheet = {
  field: {
    display: 'table-row',
    padding: '5px',
  },
  label: {
    display: 'table-cell',
    boxSizing: 'border-box',
    verticalAlign: 'top',
    paddingRight: 5,
    paddingTop: 5,
    textAlign: 'right',
    width: 80,
    fontSize: 12,
    color: 'rgb(68, 68, 68)',
    fontWeight: 600,
  },
};

stylesheet.textarea = {
  ...stylesheet.input,
  height: '100px',
};

stylesheet.checkbox = {
  ...stylesheet.input,
  width: 'auto',
};

export default class PropField extends React.Component {
  constructor(props) {
    super(props);
    this._onChange = this.onChange.bind(this);
  }

  onChange(e) {
    this.props.onChange(e.target.value);
  }

  render() {
    const { onChange, onClick, knob } = this.props;

    const InputType = TypeMap[knob.type] || InvalidType;

    return (
      <div style={stylesheet.field}>
        <label htmlFor={knob.name} style={stylesheet.label}>
          {!knob.hideLabel && `${knob.name}`}
        </label>
        <InputType knob={knob} onChange={onChange} onClick={onClick} />
      </div>
    );
  }
}

PropField.propTypes = {
  knob: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.any,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};
