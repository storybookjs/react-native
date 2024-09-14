import React, { useState } from 'react';
import {
  Modal,
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import { styled } from '@storybook/react-native-theming';
import { ColorPicker, fromHsv, HsvColor } from '../components/color-picker';

export interface ColorProps {
  arg: {
    name: string;
    value: string;
  };
  onChange: (value: string) => void;
}

const TouchableContainer = styled.View(({ theme }) => ({
  width: 40,
  height: 40,
  borderWidth: 1,
  borderColor: theme.appBorderColor,
  borderRadius: 6,
  padding: 3,
  backgroundColor: theme.background.content,
}));

const Touchable = styled.TouchableOpacity<{ color: string }>(({ color }) => ({
  width: '100%',
  height: '100%',
  borderRadius: 4,
  backgroundColor: color,
}));

const WebInput = styled('input' as any)(({ theme }) => ({
  width: 40,
  height: 40,
  borderWidth: 1,
  borderColor: theme.appBorderColor,
  borderRadius: 6,
  paddingVertical: 2,
  paddingHorizontal: 2,
  backgroundColor: theme.background.content,
}));

const ButtonTouchable = styled.TouchableOpacity<{ primary?: boolean }>(({ theme, primary }) => {
  return {
    backgroundColor: primary ? theme.color.secondary : theme.button.background,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: primary ? theme.color.secondary : theme.button.border,
    paddingVertical: 6,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  };
});

const ButtonText = styled.Text<{ primary?: boolean }>(({ theme, primary }) => {
  return {
    color: primary ? theme.color.inverseText : theme.color.defaultText,
    fontSize: theme.typography.size.s2,
    fontWeight: theme.typography.weight.bold,
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
              oldColor={arg.value}
              style={styles.picker}
            />
            <View style={styles.actionContainer}>
              <ButtonTouchable onPress={closeColorPicker}>
                <ButtonText>Cancel</ButtonText>
              </ButtonTouchable>
              <View style={{ width: 12 }} />
              <ButtonTouchable
                primary
                onPress={() => {
                  onChangeColor(currentColor);
                  closeColorPicker();
                }}
              >
                <ButtonText primary>Select</ButtonText>
              </ButtonTouchable>
            </View>
          </InnerContainer>
        </View>
      </Modal>
    </View>
  );
};

const InnerContainer = styled.View(({ theme }) => ({
  backgroundColor: theme.background.content,
  borderWidth: 1,
  borderColor: theme.appBorderColor,
  borderRadius: 10,
  margin: 24,
  padding: 10,
  maxWidth: 350,
  height: 400,
  maxHeight: Dimensions.get('screen').height - 24 * 2,
  shadowColor: '#000000',
  shadowOpacity: 0.2,
  shadowOffset: { width: 0, height: 0 },
  shadowRadius: 16,
  elevation: 10,
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
