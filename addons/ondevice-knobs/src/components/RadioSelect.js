import styled from '@emotion/native';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';

const RadioContainer = styled.View(({ isInline }) => ({
  flexDirection: isInline ? 'row' : 'column',
  alignItems: isInline ? 'center' : 'flex-start',
  flexWrap: 'wrap',
  margin: 10,
}));

const RadioTouchable = styled.TouchableOpacity(() => ({
  marginRight: 8,
  alignItems: 'center',
  flexDirection: 'row',
  padding: 4,
}));

const RadioCircle = styled.View(({ selected, theme }) => ({
  width: 20,
  height: 20,
  borderRadius: 10,
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 4,
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: selected ? 'green' : theme.borderColor,
}));

const RadioInnerCircle = styled.View(({ selected }) => ({
  position: 'absolute',
  height: 16,
  width: 16,
  borderRadius: 8,
  backgroundColor: selected ? 'green' : 'transparent',
}));

const RadioLabel = styled.Text(() => ({
  fontSize: 16,
}));

class RadioSelect extends React.Component {
  constructor(props) {
    super(props);

    const { initValue } = this.props;

    this.state = {
      value: initValue,
    };
  }

  render() {
    const { data, initValue, onChange } = this.props;
    const { value } = this.state;
    return (
      <RadioContainer>
        {data.map((item) => (
          <RadioTouchable
            key={item.label}
            activeOpacity={0.7}
            onPress={() => {
              onChange(item);
              this.setState({ value: item.key });
            }}
          >
            <RadioCircle selected={value === item.key}>
              <RadioInnerCircle selected={value === item.key} />
            </RadioCircle>
            <RadioLabel>{item.label}</RadioLabel>
          </RadioTouchable>
        ))}
      </RadioContainer>
    );
  }
}

export default RadioSelect;

RadioSelect.defaultProps = {
  data: [],
  onChange: (value) => value,
  initValue: '',
};

RadioSelect.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  initValue: PropTypes.string,
  onChange: PropTypes.func,
};
