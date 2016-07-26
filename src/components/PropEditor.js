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
  propEditorClosed: {
    width: 'auto',
  },
  title: {
    color: 'rgb(68, 68, 68)',
    letterSpacing: '2px',
    fontSize: '12px',
    margin: '0px 10px 15px 0px',
  },
  titleClosed: {
    margin: '0px 0px 0px 0px',
    float: 'left',
    marginRight: '15px',
  },
  connerButton: {
    position: 'absolute',
    color: 'rgb(135, 135, 135)',
    right: '10px',
    top: '10px',
    padding: '0',
    height: '10px',
    width: '10px',
    lineHeight: '10px',
    textAlign: 'center',
    cursor: 'pointer',
  },
};

export default class PropEditor extends React.Component {
  constructor(props) {
    super(props);
    this._handleChange = this.handleChange.bind(this);
    this._createKnob = this.createKnob.bind(this);
    this._shouldStoryUpdate = this.shouldStoryUpdate.bind(this);
    this.state = { fields: this.props.initialValues };
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

  createKnob(name) {
    const field = this.state.fields[name];
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
    let editorContent;

    if (this.state.closed) {
      editorContent = (
        <div style={{ ...stylesheet.propEditor, ...stylesheet.propEditorClosed }}>
          <h3 style={{ ...stylesheet.title, ...stylesheet.titleClosed }}>KNOBS</h3>
          <div
            style={stylesheet.connerButton}
            onClick={() => {this.setState({ closed: false });}}
          >
          &#x2228;
          </div>
        </div>
      );
    } else {
      editorContent = (
        <div style={stylesheet.propEditor}>
          <h3 style={stylesheet.title}>KNOBS</h3>
          <div
            style={stylesheet.connerButton}
            onClick={() => {this.setState({ closed: true });}}
          >
            &#x2715;
          </div>
          <PropForm fields={this.state.fields} onFieldChange={this._handleChange} />
        </div>
      );
    }

    return (
      <div>
        <Story
          storyFn={this.props.storyFn}
          context={this.props.context}
          createKnob={this._createKnob}
          shouldUpdate={this._shouldStoryUpdate}
        />
        { editorContent }
      </div>
    );
  }
}

PropEditor.propTypes = {
  initialValues: React.PropTypes.object.isRequired,
  storyFn: React.PropTypes.func.isRequired,
  context: React.PropTypes.object.isRequired,
};

PropEditor.displayName = 'PropEditorWrapper';
