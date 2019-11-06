import PropTypes from 'prop-types';
import React from 'react';
import deepEqual from 'deep-equal';
import styled from '@emotion/native';

const Input = styled.TextInput(({ theme }) => ({
  borderWidth: 1,
  borderRadius: 2,
  fontSize: 13,
  padding: 5,
  margin: 10,
  borderColor: theme.borderColor,
  color: theme.labelColor,
}));

class ObjectType extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {};
  }

  getJSONString() {
    const { json, jsonString } = this.state;
    const { knob } = this.props;

    // If there is an error in the JSON, we need to give that errored JSON.
    if (this.failed) return jsonString;

    // If the editor value and the knob value is the same, we need to return the
    // editor value as it allow user to add new fields to the JSON.
    if (deepEqual(json, knob.value)) return jsonString;

    // If the knob's value is different from the editor, it seems like
    // there's a outside change and we need to get that.
    return JSON.stringify(knob.value, null, 2);
  }

  handleChange = value => {
    const { onChange } = this.props;

    const withReplacedQuotes = value
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"');

    const newState = {
      jsonString: withReplacedQuotes,
    };

    try {
      newState.json = JSON.parse(withReplacedQuotes.trim());

      onChange(newState.json);
      this.failed = false;
    } catch (err) {
      this.failed = true;
    }

    this.setState(newState);
  };

  render() {
    const { knob } = this.props;
    const jsonString = this.getJSONString();
    const extraStyle = {};

    if (this.failed) {
      extraStyle.borderWidth = 1;
      extraStyle.borderColor = '#fadddd';
      extraStyle.backgroundColor = '#fff5f5';
    }

    return (
      <Input
        id={knob.name}
        style={extraStyle}
        value={jsonString}
        onChangeText={this.handleChange}
        multiline
        autoCapitalize="none"
        underlineColorAndroid="transparent"
      />
    );
  }
}

ObjectType.defaultProps = {
  knob: {},
  onChange: value => value,
};

ObjectType.propTypes = {
  knob: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  }),
  onChange: PropTypes.func,
};

ObjectType.serialize = object => JSON.stringify(object);
ObjectType.deserialize = value => (value ? JSON.parse(value) : {});

export default ObjectType;
