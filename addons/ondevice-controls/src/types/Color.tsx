import React, { useState } from 'react';
import {
  Text,
  Modal,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
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

const Touchable = styled.TouchableOpacity(({ theme, color }: any) => ({
  borderColor: theme.borderColor || '#e6e6e6',
  width: 30,
  height: 20,
  borderRadius: 2,
  borderWidth: 1,
  margin: 10,
  backgroundColor: color,
}));

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

  return (
    <View>
      <Touchable color={arg.value} onPress={openColorPicker} />
      <Modal
        supportedOrientations={['portrait', 'landscape']}
        transparent
        visible={displayColorPicker}
        onRequestClose={closeColorPicker}
      >
        <TouchableWithoutFeedback onPress={closeColorPicker}>
          <View style={styles.containerCenter}>
            <TouchableWithoutFeedback>
              <View style={styles.innerContainer}>
                <TouchableOpacity onPress={closeColorPicker} style={styles.end}>
                  <Text style={styles.close}>X</Text>
                </TouchableOpacity>
                <ColorPicker
                  onColorSelected={onChangeColor}
                  onColorChange={(color: HsvColor) => setCurrentColor(color)}
                  defaultColor={arg.value}
                  style={styles.picker}
                />
                <View style={styles.applyContainer}>
                  <TouchableOpacity
                    style={styles.applyButton}
                    onPress={() => onChangeColor(currentColor)}
                  >
                    <Text style={styles.applyText}>Apply</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  applyText: { color: '#1EA7FD', fontSize: 16 },
  applyButton: { paddingVertical: 8, paddingHorizontal: 16 },
  applyContainer: { alignItems: 'center' },
  picker: { flex: 1 },
  close: { fontSize: 18, fontWeight: 'bold' },
  end: { alignSelf: 'flex-end', padding: 5 },
  innerContainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgb(247, 244, 244)',
    width: 250,
    height: 250,
    padding: 10,
  },
  containerCenter: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

ColorType.serialize = (value) => value;

ColorType.deserialize = (value) => value;
export default ColorType;
