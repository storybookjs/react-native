import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import React from 'react';
import styled from '@emotion/native';
import TypeMap from './types';

const InvalidType = () => <Text style={{ margin: 10 }}>Invalid Type</Text>;

const Label = styled.Text(({ theme }) => ({
  paddingBottom: theme.tokens.spacing1,
  fontSize: theme.inputs.labelFontSize,
  color: theme.inputs.labelTextColor,
  fontWeight: '500',
}));

const Container = styled.View(({ theme }) => ({
  paddingBottom: theme.tokens.spacing4,
}));

const InputContainer = styled.View();

const PropField = ({ onChange, onPress, knob }) => {
  const InputType = TypeMap[knob.type] || InvalidType;

  return (
    <Container>
      {!knob.hideLabel ? <Label>{`${knob.label || knob.name}`}</Label> : null}
      <InputContainer>
        <InputType knob={knob} onChange={onChange} onPress={onPress} />
      </InputContainer>
    </Container>
  );
};

PropField.propTypes = {
  knob: PropTypes.shape({
    name: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.any,
    hideLabel: PropTypes.bool,
    type: PropTypes.oneOf([
      'text',
      'number',
      'color',
      'boolean',
      'object',
      'select',
      'array',
      'date',
      'button',
      'radios',
    ]),
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onPress: PropTypes.func.isRequired,
};

export default PropField;
