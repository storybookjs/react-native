import React, { useState } from 'react';
import {
  Text,
  Modal,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Platform,
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

  if (Platform.OS === 'web') {
    return (
      <input
        type="color"
        style={{ margin: 10 }}
        value={arg.value}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  }

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
            <View style={styles.innerContainer}>
              <ColorPicker
                onColorSelected={onChangeColor}
                onColorChange={(color: HsvColor) => setCurrentColor(color)}
                defaultColor={arg.value}
                style={styles.picker}
              />
              <View style={styles.actionContainer}>
                <TouchableOpacity style={styles.actionButton} onPress={closeColorPicker}>
                  <Text style={styles.actionText}>CANCEL</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => {
                    onChangeColor(currentColor);
                    closeColorPicker();
                  }}
                >
                  <Text style={styles.actionText}>DONE</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  actionText: { color: '#1EA7FD', fontSize: 16 },
  actionButton: { paddingVertical: 8, paddingHorizontal: 8, marginTop: 16 },
  actionContainer: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
  },
  picker: { flex: 1, marginTop: 16 },
  close: { fontSize: 18, fontWeight: 'bold' },
  end: { alignSelf: 'flex-end', padding: 5 },
  innerContainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgb(247, 244, 244)',
    width: 350,
    height: 350,
    padding: 8,
    borderRadius: 4,
  },
  containerCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
});

ColorType.serialize = (value) => value;

ColorType.deserialize = (value) => value;
export default ColorType;
