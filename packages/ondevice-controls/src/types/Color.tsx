import React, { useState } from 'react';
import {
  Modal,
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import styled from '@emotion/native';
import { ColorPicker, fromHsv, HsvColor } from '../components/color-picker';

export interface ColorProps {
  arg: {
    name: string;
    value: string;
  };
  onChange: (value: string) => void;
}

const TouchableContainer = styled.View(({ theme }) => ({
  width: theme.inputs.swatch.height,
  height: theme.inputs.swatch.height,
  borderWidth: theme.inputs.swatch.borderWidth,
  borderColor: theme.inputs.swatch.borderColor,
  borderRadius: theme.inputs.swatch.outerBorderRadius,
  paddingVertical: theme.inputs.swatch.paddingVertical,
  paddingHorizontal: theme.inputs.swatch.paddingHorizontal,
  backgroundColor: theme.inputs.swatch.backgroundColor,
}));

const Touchable = styled.TouchableOpacity<{ color: string }>(({ theme, color }) => ({
  width: '100%',
  height: '100%',
  borderRadius: theme.inputs.swatch.innerBorderRadius,
  backgroundColor: color,
}));

const WebInput = styled('input' as any)(({ theme }) => ({
  width: theme.inputs.swatch.height,
  height: theme.inputs.swatch.height,
  borderWidth: theme.inputs.swatch.borderWidth,
  borderColor: theme.inputs.swatch.borderColor,
  borderRadius: theme.inputs.swatch.outerBorderRadius,
  paddingVertical: theme.inputs.swatch.paddingVertical,
  paddingHorizontal: theme.inputs.swatch.paddingHorizontal,
  backgroundColor: theme.inputs.swatch.backgroundColor,
}));

const ButtonTouchable = styled.TouchableOpacity<{ primary?: boolean }>(({ theme, primary }) => {
  const buttonTheme = primary ? theme.button.primary : theme.button.secondary;
  return {
    backgroundColor: buttonTheme.backgroundColor,
    borderRadius: buttonTheme.borderRadius,
    borderWidth: buttonTheme.borderWidth,
    borderColor: buttonTheme.borderColor,
    paddingVertical: theme.button.paddingVertical,
    paddingHorizontal: theme.button.paddingHorizontal,
    justifyContent: 'center',
    alignItems: 'center',
  };
});

const ButtonText = styled.Text<{ primary?: boolean }>(({ theme, primary }) => {
  const buttonTheme = primary ? theme.button.primary : theme.button.secondary;
  return {
    color: buttonTheme.textColor,
    fontSize: theme.button.fontSize,
    fontWeight: theme.button.fontWeight,
  };
});

const ColorType = ({ arg, onChange = (value) => value }: ColorProps) => {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [currentColor, setCurrentColor] = useState<HsvColor | null>(null);

  const openColorPicker = () => {
    setDisplayColorPicker(true);
  };

  const closeColorPicker = () => {
    setDisplayColorPicker(false);
  };

  const onChangeColor = (color) => {
    onChange(fromHsv(color));
  };

  if (Platform.OS === 'web') {
    return (
      <WebInput type="color" value={arg.value} onChange={(event) => onChange(event.target.value)} />
    );
  }

  return (
    <View>
      <TouchableContainer>
        <Touchable color={arg.value} onPress={openColorPicker} />
      </TouchableContainer>
      <Modal
        supportedOrientations={['portrait', 'landscape']}
        transparent
        visible={displayColorPicker}
        onRequestClose={closeColorPicker}
      >
        <TouchableWithoutFeedback onPress={closeColorPicker}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.centerContainer}>
          <InnerContainer pointerEvents="box-none">
            <ColorPicker
              onColorSelected={onChangeColor}
              onColorChange={(color: HsvColor) => setCurrentColor(color)}
              defaultColor={arg.value}
              style={styles.picker}
            />
            <View style={styles.actionContainer}>
              <ButtonTouchable onPress={closeColorPicker}>
                <ButtonText>CANCEL</ButtonText>
              </ButtonTouchable>
              <View style={{ width: 12 }} />
              <ButtonTouchable
                primary
                onPress={() => {
                  onChangeColor(currentColor);
                  closeColorPicker();
                }}
              >
                <ButtonText primary>SELECT</ButtonText>
              </ButtonTouchable>
            </View>
          </InnerContainer>
        </View>
      </Modal>
    </View>
  );
};

const InnerContainer = styled.View(({ theme }) => ({
  backgroundColor: theme.panel.backgroundColor,
  borderWidth: theme.panel.borderWidth,
  borderColor: theme.panel.borderColor,
  borderRadius: theme.tokens.borderRadius.large,
  margin: 24,
  padding: theme.tokens.spacing3,
  maxWidth: 350,
  height: 400,
  maxHeight: Dimensions.get('screen').height - 24 * 2,
  ...theme.tokens.elevation.floating,
}));

const styles = StyleSheet.create({
  actionContainer: {
    paddingTop: 8,
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
  },
  picker: { flex: 1 },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
});

ColorType.serialize = (value) => value;

ColorType.deserialize = (value) => value;
export default ColorType;
