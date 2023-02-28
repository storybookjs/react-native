import styled from '@emotion/native';
import PropTypes from 'prop-types';
import React from 'react';

const RadioContainer = styled.View(({ theme, isInline }) => ({
  flexDirection: isInline ? 'row' : 'column',
  alignItems: isInline ? 'center' : 'flex-start',
  flexWrap: 'wrap',
}));

const RadioTouchable = styled.TouchableOpacity(({ theme }) => ({
  alignItems: 'center',
  flexDirection: 'row',
  paddingVertical: theme.inputs.radio.itemSpacing,
}));

const RadioCircle = styled.View(({ theme }) => ({
  width: theme.inputs.radio.height,
  height: theme.inputs.radio.height,
  borderWidth: theme.inputs.radio.borderWidth,
  borderColor: theme.inputs.radio.borderColor,
  borderRadius: theme.tokens.borderRadius.round,
  backgroundColor: theme.inputs.radio.backgroundColor,
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: theme.inputs.radio.paddingVertical,
  paddingHorizontal: theme.inputs.radio.paddingHorizontal,
}));

const RadioInnerCircle = styled.View(({ theme, selected }) => ({
  position: 'absolute',
  height: '100%',
  width: '100%',
  borderRadius: theme.tokens.borderRadius.round,
  backgroundColor: selected ? theme.inputs.radio.activeBackgroundColor : 'transparent',
}));

const RadioLabel = styled.Text(({ theme }) => ({
  fontSize: theme.inputs.radio.fontSize,
  paddingStart: theme.inputs.radio.labelSpacing,
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
    const { data, onChange } = this.props;
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
            <RadioCircle>
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
