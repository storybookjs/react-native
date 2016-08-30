import React from 'react';
import PropForm from './PropForm';
import tosource from 'tosource';
import { js_beautify as beautify } from 'js-beautify';

const styles = {
  panel: {
    padding: '5px',
    width: '100%',
  },
  noKnobs: {
    fontFamily: `
      -apple-system, ".SFNSText-Regular", "San Francisco", "Roboto",
      "Segoe UI", "Helvetica Neue", "Lucida Grande", sans-serif
    `,
    display: 'inline',
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
    this._setInitialFields = this.setInitialFields.bind(this);
    this._indicateReady = this.indicateReady.bind(this);

    this.state = { fields: {} };
    this.api = this.props.api;
  }

  componentWillMount() {
    const urlState = this.api.getQueryParam('knobs');

    if (urlState && urlState.length > 0) {
      this.initialFields = JSON.parse(urlState);
    }

    if (this.initialFields) {
      this.props.channel.on('addon:knobs:helloFromStory', this._setInitialFields);
      this.setState({ fields: this.initialFields });
    } else {
      this.props.channel.on('addon:knobs:helloFromStory', this._indicateReady);
    }
  }

  componentDidMount() {
    this.stopOnStory = this.api.onStory(() => {
      this.api.setQueryParams({ knobs: null });
    });

    this.props.channel.on('addon:knobs:setFields', this._setFields);
    this.props.channel.emit('addon:knobs:helloFromPanel');
  }

  componentWillUnmount() {
    this.props.channel.removeListener('addon:knobs:setFields', this._setFields);
    this.props.channel.removeListener('addon:knobs:helloFromStory', this._indicateReady);
    this.props.channel.removeListener('addon:knobs:helloFromStory', this._setInitialFields);
    this.stopOnStory();
  }

  setInitialFields() {
    this.props.channel.emit('addon:knobs:initialFields', this.initialFields);
    this.props.channel.removeListener('addon:knobs:helloFromStory', this._setInitialFields);
    this.props.channel.on('addon:knobs:helloFromStory', this._indicateReady);
  }

  setFields(_fields) {
    const fields = _fields;
    for (const f in fields) {
      if (fields.hasOwnProperty(f)) {
        if (fields[f].type === 'object') {
          fields[f].value = beautify(tosource(fields[f].value));
        }
      }
    }
    this.setState({ fields });
    this.api.setQueryParams({ knobs: JSON.stringify(fields) });
  }

  indicateReady() {
    this.props.channel.emit('addon:knobs:panelReady');
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
    this.api.setQueryParams({ knobs: JSON.stringify(newFields) });

    this.props.channel.emit('addon:knobs:knobChange', change);
  }

  render() {
    const fields = this.state.fields;
    const fieldsArray = Object.keys(fields).map(key => (fields[key]));

    if (fieldsArray.length === 0) {
      return (
        <div style={styles.noKnobs}>NO KNOBS</div>
      );
    }

    return (
      <div style={styles.panel}>
        <PropForm fields={fieldsArray} onFieldChange={this._handleChange} />
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
