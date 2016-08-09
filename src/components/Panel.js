import React from 'react';
import PropForm from './PropForm';

export default class Panel extends React.Component {
  constructor(props) {
    super(props);
    this._handleChange = this.handleChange.bind(this);
    this._setFields = this.setFields.bind(this);
    this.state = { fields: this.props.initialFields || {} };
  }

  componentDidMount() {
    this.props.channel.on('addon:knobs:setFields', this._setFields);
  }

  setFields(_fields) {
    const fields = _fields;
    for (const f in fields) {
      if (fields.hasOwnProperty(f)) {
        if (fields[f].type === 'object') {
          fields[f].value = JSON.stringify(fields[f].value);
        }
      }
    }
    this.setState({ fields });
  }

  handleChange(change) {
    const { name, value } = change;

    const fields = this.state.fields;
    const changedField = {};
    changedField[name] = { ...fields[name], ...{ value } };
    const newFields = { ...fields, ...changedField };
    this.setState({ fields: newFields });

    this.props.channel.emit('addon:knobs:propChange', change);
  }

  render() {
    return (
      <div>
        <PropForm fields={this.state.fields} onFieldChange={this._handleChange} />
      </div>
    );
  }
}

Panel.propTypes = {
  initialFields: React.PropTypes.object,
  onChange: React.PropTypes.func,
  channel: React.PropTypes.object,
};
