import React from 'react';
import AceEditor from 'react-ace';

import 'brace/mode/javascript';
import 'brace/theme/github';

const stylesheet = {
  input: {
    display: 'table-cell',
    boxSizing: 'border-box',
    verticalAlign: 'middle',
    height: '26px',
    width: '100%',
    outline: 'none',
    border: '1px solid rgb(236, 236, 236)',
    fontSize: '12px',
    padding: '5px',
    color: 'rgb(130, 130, 130)',
  },
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
    const type = this.props.type;

    if (type === 'func') {
      return null;
    }

    let inputElem = (
      <input
        id={this.props.name}
        style={stylesheet.input}
        value={this.props.value}
        onChange={this._onChange}
      />
    );

    if (type === 'object') {
      inputElem = (
        <div style={{ border: '1px solid rgb(236, 236, 236)', padding: '5px' }}>
          <AceEditor
            mode="javascript"
            theme="github"
            value={this.props.value}
            onChange={this._onChangeObj}
            name={this.props.name}
            width="100%"
            height="120px"
            editorProps={{ $blockScrolling: true }}
            setOptions={{ showLineNumbers: false }}
            showPrintMargin={false}
            showGutter={false}
            highlightActiveLine={false}
          />
        </div>
      );
    }

    if (type === 'number') {
      inputElem = (
        <input
          id={this.props.name}
          style={stylesheet.input}
          value={this.props.value}
          type="number"
          onChange={this._onChange}
        />
      );
    }

    if (type === 'boolean') {
      inputElem = (
        <input
          id={this.props.name}
          style={stylesheet.checkbox}
          checked={this.props.value}
          value={this.props.value}
          type="checkbox"
          onChange={this._onChangeBool}
        />
      );
    }

    const labelStyles =
      type === 'object' ? stylesheet.objectInputLabel : stylesheet.label;

    return (
      <div style={stylesheet.field}>
        <label htmlFor={this.props.name} style={labelStyles}>
          {`${this.props.name}`}
        </label>
        { inputElem }
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
