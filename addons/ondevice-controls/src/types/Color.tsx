import PropTypes from 'prop-types';
import React from 'react';
import { Text, Modal, View, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import styled from '@emotion/native';
import { ColorPicker, fromHsv } from '../components/color-picker';

interface ColorProps {
  knob: {
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

class ColorType extends React.Component<ColorProps, { displayColorPicker: boolean }> {
  static defaultProps = {
    knob: {},
    onChange: (value) => value,
  };

  static serialize = (value) => value;

  static deserialize = (value) => value;

  constructor(props) {
    super(props);
    this.state = {
      displayColorPicker: false,
    };
  }

  openColorPicker = () => {
    this.setState({
      displayColorPicker: true,
    });
  };

  closeColorPicker = () => {
    this.setState({
      displayColorPicker: false,
    });
  };

  onChangeColor = (color) => {
    const { onChange } = this.props;

    onChange(fromHsv(color));
  };

  render() {
    const { knob } = this.props;
    const { displayColorPicker } = this.state;
    return (
      <View>
        <Touchable color={knob.value} onPress={this.openColorPicker} />
        <Modal
          supportedOrientations={['portrait', 'landscape']}
          transparent
          visible={displayColorPicker}
          onRequestClose={this.closeColorPicker}
        >
          <TouchableWithoutFeedback onPress={this.closeColorPicker}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <TouchableWithoutFeedback>
                <View
                  style={{
                    backgroundColor: 'white',
                    borderWidth: 1,
                    borderColor: 'rgb(247, 244, 244)',
                    width: 250,
                    height: 250,
                    padding: 10,
                  }}
                >
                  <TouchableOpacity
                    onPress={this.closeColorPicker}
                    style={{ alignSelf: 'flex-end', padding: 5 }}
                  >
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>X</Text>
                  </TouchableOpacity>
                  <ColorPicker
                    onColorSelected={this.onChangeColor}
                    defaultColor={knob.value}
                    style={{ flex: 1 }}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    );
  }
}

export default ColorType;
