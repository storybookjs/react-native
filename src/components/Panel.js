import React from 'react';
import PropForm from './PropForm';
import tosource from 'tosource';

const styles = {
  panel: {
    padding: '5px',
    backgroundColor: 'rgb(247, 247, 247)',
    width: '100%',
  },
  noKnobs: {
    fontFamily: `
      -apple-system, ".SFNSText-Regular", "San Francisco", "Roboto",
      "Segoe UI", "Helvetica Neue", "Lucida Grande", sans-serif
    `,
    display: 'inline',
    backgroundColor: 'rgb(247, 247, 247)',
    width: '100%',
    textAlign: 'center',
    color: 'rgb(190, 190, 190)',
    padding: '10px',
  },
  resetButton: {
    color: 'rgb(130, 130, 130)',
    float: 'right',
    marginRight: '5px',
    marginTop: '5px',
  },
};

export default class Panel extends React.Component {
  constructor(props) {
    super(props);
    this._handleChange = this.handleChange.bind(this);
    this._setFields = this.setFields.bind(this);
    this._reset = this.reset.bind(this);
    this.state = { fields: {} };
  }

  componentDidMount() {
    this.props.channel.on('addon:knobs:setFields', this._setFields);
    this.props.api.onStory(() => {
      this.setState({ fields: false });
    });
  }

  setFields(_fields) {
    const fields = _fields;
    for (const f in fields) {
      if (fields.hasOwnProperty(f)) {
        if (fields[f].type === 'object') {
          fields[f].value = tosource(fields[f].value);
        }
      }
    }
    this.setState({ fields });
  }

  reset() {
    this.props.channel.emit('addon:knobs:reset');
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
    if (!this.state.fields) {
      return (
        <div style={styles.noKnobs}>NO KNOBS</div>
      );
    }

    return (
      <div style={styles.panel}>
        <PropForm fields={this.state.fields} onFieldChange={this._handleChange} />
        <button style={styles.resetButton} onClick={this._reset}>RESET</button>
      </div>
    );
  }
}

Panel.propTypes = {
  channel: React.PropTypes.object,
  onReset: React.PropTypes.object,
  api: React.PropTypes.object,
};
