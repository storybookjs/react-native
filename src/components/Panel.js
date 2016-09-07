import React from 'react';
import PropForm from './PropForm';
import tosource from 'tosource';
import { js_beautify as beautify } from 'js-beautify'; // eslint-disable-line camelcase
import Types from './types';

const styles = {
  panel: {
    padding: '5px',
    width: 380,
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
    bottom: 11,
    right: 10,
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
    this.handleChange = this.handleChange.bind(this);
    this.setKnobs = this.setKnobs.bind(this);
    this.checkUrlAndsetKnobs = this.checkUrlAndsetKnobs.bind(this);
    this.reset = this.reset.bind(this);

    this.state = { fields: {} };
    this.api = this.props.api;
    this.loadedFromUrl = false;
  }

  stopOnStory() {
    this.api.setQueryParams({ knobs: null });
  }

  componentWillMount() {
    // Just for the first time, we need to get fields from the URL and set them.
    this.props.channel.on('addon:knobs:setKnobs', this.setKnobs);
  }

  componentWillUnmount() {
    this.props.channel.removeListener('addon:knobs:setKnobs', this.setKnobs);
    this.stopOnStory();
  }

  setKnobs(knobs) {
    const queryParams = {};
    const { api, channel } = this.props;

    Object.keys(knobs).forEach((name) => {
      const knob = knobs[name];
      if (!this.loadedFromUrl) {
        const urlValue = api.getQueryParam(`knob-${name}`);
        knob.value = Types[knob.type].deserialize(urlValue);
        console.log(knob.value);
        channel.emit('addon:knobs:knobChange', knob);
      }

      queryParams[`knob-${name}`] = Types[knob.type].serialize(knob.value);
    });

    this.loadedFromUrl = true;
    this.api.setQueryParams(queryParams);
    this.setState({ fields: knobs });
  }

  checkUrlAndsetKnobs(_fields) {
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

    this.setKnobs(fields);

    // Listen to the selFields event in the future.
    this.props.channel.on('addon:knobs:setKnobs', this.setKnobs);
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
      <div>
        <div style={styles.panel}>
          <PropForm fields={fieldsArray} onFieldChange={this.handleChange} />
        </div>
        <button style={styles.resetButton} onClick={this.reset}>RESET</button>
      </div>
    );
  }
}

Panel.propTypes = {
  channel: React.PropTypes.object,
  onReset: React.PropTypes.object,
  api: React.PropTypes.object,
};
