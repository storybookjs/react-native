import React from 'react';
import AceEditor from 'react-ace';
import TypeMap from './types';

import 'brace/mode/javascript';
import 'brace/theme/github';

const InvalidType = () => (<span>Invalid Type</span>);

const stylesheet = {
  field: {
    display: 'table-row',
    padding: '5px',
  },
  label: {
    display: 'table-cell',
    boxSizing: 'border-box',
    verticalAlign: 'middle',
    paddingRight: '5px',
    textAlign: 'right',
    width: '20px',
    fontSize: '13px',
    color: 'rgb(68, 68, 68)',
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

stylesheet.objectInputLabel = {
  ...stylesheet.label,
  verticalAlign: 'top',
};

export default class PropField extends React.Component {
  constructor(props) {
    super(props);
    this._onChange = this.onChange.bind(this);
    this._onChangeBool = this.onChangeBool.bind(this);
    this._onChangeObj = this.onChangeObj.bind(this);
  }

  onChange(e) {
    this.props.onChange(e.target.value);
  }

  onChangeBool(e) {
    this.props.onChange(e.target.checked);
  }

  onChangeObj(value) {
    this.props.onChange(value);
  }

  render() {
    const { value, name, type, onChange } = this.props;

    let InputType = TypeMap[type] || InvalidType;
    const labelStyles =
      type === 'object' ? stylesheet.objectInputLabel : stylesheet.label;

    return (
      <div style={stylesheet.field}>
        <label htmlFor={this.props.name} style={labelStyles}>
          {`${this.props.name}`}
        </label>
        <InputType
          value={value}
          name={name}
          onChange={onChange}
        />
      </div>
    );
  }
}

PropField.propTypes = {
  name: React.PropTypes.string.isRequired,
  onChange: React.PropTypes.func.isRequired,
  type: React.PropTypes.oneOf(['text', 'object', 'number', 'boolean']),
  value: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
    React.PropTypes.bool,
  ]).isRequired,
};
