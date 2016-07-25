import React from 'react';
import PropForm from './PropForm';
import Story from './Story';

const stylesheet = {
  propEditor: {
    fontFamily: `
      -apple-system, ".SFNSText-Regular", "San Francisco", "Roboto",
      "Segoe UI", "Helvetica Neue", "Lucida Grande", sans-serif
    `,
    position: 'fixed',
    top: '8px',
    right: '8px',
    width: '30%',
    backgroundColor: 'rgb(247, 247, 247)',
    border: '1px solid rgb(236, 236, 236)',
    borderRadius: '4px',
    padding: '10px',
  },
  title: {
    color: 'rgb(68, 68, 68)',
    letterSpacing: '2px',
    fontSize: '12px',
    margin: '0px 10px 15px 0px',
  },
};

export default class PropEditor extends React.Component {
  constructor() {
    super();
    this._handleChange = this.handleChange.bind(this);
    this._createKnob = this.createKnob.bind(this);
    this._shouldStoryUpdate = this.shouldStoryUpdate.bind(this);
    this.state = { fields: {} };
  }

  handleChange(change) {
    const { name, value } = change;
    const fields = this.state.fields;
    const { type } = fields[name];
    fields[name].valid = true;
    if (type === 'object') {
      try {
        eval(`(${value})`); // eslint-disable-line no-eval
      } catch (e) {
        fields[name].valid = false;
      }
    }

    fields[name].value = value;
    this.setState({ fields });
  }

  createKnob(name, initial, type) {
    const field = this.state.fields[name];

    if (field) {
      let { value } = field;
      if (field.type === 'object') {
        try {
          value = eval(`(${value})`); // eslint-disable-line no-eval
        } catch (e) {
          return {};
        }
      }

      return value;
    }

    let value = initial;
    if (type === 'object') {
      value = JSON.stringify(value, null, 4);
    }

    this.state.fields[name] = {
      name,
      value,
      type,
      valid: true,
    };

    return initial;
  }

  shouldStoryUpdate() {
    // Dont re-render story when at least one prop is invalid
    const fields = this.state.fields;
    for (const prop in fields) {
      if (!fields.hasOwnProperty(prop)) {
        continue;
      }
      if (fields[prop].valid === false) {
        return false;
      }
    }

    return true;
  }

  render() {
    return (
      <div>
        <Story
          storyFn={this.props.storyFn}
          context={this.props.context}
          createKnob={this._createKnob}
          shouldUpdate={this._shouldStoryUpdate}
        />
        <div style={stylesheet.propEditor}>
          <h3 style={stylesheet.title}>KNOBS</h3>
          <PropForm fields={this.state.fields} onFieldChange={this._handleChange} />
        </div>
      </div>
    );
  }
}

PropEditor.propTypes = {
  storyFn: React.PropTypes.func.isRequired,
  context: React.PropTypes.object.isRequired,
};

PropEditor.displayName = 'PropEditorWrapper';
