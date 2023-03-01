// @ts-ignore
import styled from '@emotion/native';
import PropTypes from 'prop-types';
import React from 'react';

interface SwatchProps {
  name: string;
  value: string;
  setBackground: (background: string) => void;
}

const PressableSwatch = styled.TouchableOpacity(({ theme }: any) => ({
  marginBottom: theme.tokens.spacing3,
  borderWidth: theme.inputs.swatch.borderWidth,
  borderColor: theme.inputs.swatch.borderColor,
  borderRadius: theme.inputs.swatch.outerBorderRadius,
  backgroundColor: theme.inputs.swatch.backgroundColor,
  paddingVertical: theme.inputs.swatch.paddingVertical,
  paddingHorizontal: theme.inputs.swatch.paddingHorizontal,
}));

const ColorSwatch = styled.View(({ theme, color }: any) => ({
  flex: 1,
  height: theme.inputs.swatch.height,
  borderRadius: theme.inputs.swatch.innerBorderRadius,
  backgroundColor: color,
}));

const ValueContainer = styled.View(({ theme }: any) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  padding: theme.tokens.spacing1,
  paddingBottom: 0,
}));
const NameText = styled.Text(({ theme }: any) => ({
  fontSize: theme.inputs.swatch.fontSize,
  fontWeight: theme.inputs.swatch.nameTextWeight,
}));
const ValueText = styled.Text(({ theme }: any) => ({
  fontSize: theme.inputs.swatch.fontSize,
}));

const Swatch = ({ name, value, setBackground }: SwatchProps) => (
  <PressableSwatch onPress={() => setBackground(value)}>
    <ColorSwatch color={value} />
    <ValueContainer>
      <NameText>{name}</NameText>
      <ValueText>{value}</ValueText>
    </ValueContainer>
  </PressableSwatch>
);

Swatch.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  setBackground: PropTypes.func.isRequired,
};

export default Swatch;
