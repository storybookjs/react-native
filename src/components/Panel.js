import React from 'react';
import PropForm from './PropForm';
import tosource from 'tosource';
import { js_beautify as beautify } from 'js-beautify'; // eslint-disable-line camelcase

const styles = {
  panel: {
    padding: '5px',
    width: '100%',
    position: 'relative',
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
    position: 'absolute',
    bottom: 0, right: 0,
    border: 'none',
    borderTop: 'solid 1px rgba(0, 0, 0, 0.2)',
    borderLeft: 'solid 1px rgba(0, 0, 0, 0.2)',
    background: 'rgba(255, 255, 255, 0.5)',
    padding: '5px 10px',
    borderRadius: '4px 0 0 0',
    color: 'rgba(0, 0, 0, 0.5)',
    outline: 'none',
  },
};

export default class Panel extends React.Component {
  constructor(props) {
    super(props);
    this._handleChange = this.handleChange.bind(this);
    this._setFields = this.setFields.bind(this);
    this._checkUrlAndsetFields = this.checkUrlAndsetFields.bind(this);
    this._reset = this.reset.bind(this);

    this.state = { fields: {} };
    this.api = this.props.api;
  }

  componentWillMount() {
    this.props.channel.on('addon:knobs:setFields', this._checkUrlAndsetFields);
  }

  componentDidMount() {
    this.stopOnStory = this.api.onStory(() => {
      this.api.setQueryParams({ knobs: null });
    });
  }

  componentWillUnmount() {
    this.props.channel.removeListener('addon:knobs:setFields', this._setFields);
    this.stopOnStory();
  }

  setFields(_fields) {
    const fields = _fields;
    const queryParams = {};
    for (const f in fields) {
      if (fields.hasOwnProperty(f)) {
        queryParams[`knob-${f}`] = fields[f].value;
        if (fields[f].type === 'object') {
          fields[f].value = beautify(tosource(fields[f].value));
        }
      }
    }
    this.api.setQueryParams(queryParams);
    this.setState({ fields });
  }

  checkUrlAndsetFields(_fields) {
    const fields = _fields;
    for (const name in fields) {
      if (fields.hasOwnProperty(name)) {
        let urlValue = this.api.getQueryParam(`knob-${name}`);
        if (urlValue !== undefined) {
          // When saved in url the information of whether number or string or bool is lost
          // so have to convert numbers and booleans back.
          switch (fields[name].type) {
            case 'boolean':
              urlValue = (urlValue === 'true');
              break;
            case 'number':
              urlValue = Number(urlValue);
              break;
            default:
          }

          fields[name].value = urlValue;
          this.props.channel.emit('addon:knobs:knobChange', { name, value: urlValue });
        }
      }
    }
    this.props.channel.removeListener('addon:knobs:setFields', this._checkUrlAndsetFields);
    this.props.channel.on('addon:knobs:setFields', this._setFields);
    this.setFields(fields);
  }

  reset() {
    this.props.channel.emit('addon:knobs:reset');
  }

  handleChange(change) {
    const { name, value, type } = change;

    const fields = this.state.fields;
    const changedField = {};
    changedField[name] = { ...fields[name], ...{ value } };
    const newFields = { ...fields, ...changedField };
    this.setState({ fields: newFields });

    let formatedValue = value;
    switch (type) {
      case 'object':
        try {
          formatedValue = eval(`(${value})`); // eslint-disable-line no-eval
        } catch (e) {
          return;
        }
        break;
      case 'number':
        try {
          formatedValue = Number(value);
        } catch (e) {
          return;
        }
        break;
      default:
        formatedValue = value;
    }

    const queryParams = {};
    queryParams[`knob-${name}`] = formatedValue;
    this.api.setQueryParams(queryParams);

    this.props.channel.emit('addon:knobs:knobChange', { name, value: formatedValue });
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
