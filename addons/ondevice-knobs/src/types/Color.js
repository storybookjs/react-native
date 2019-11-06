import PropTypes from 'prop-types';
import React from 'react';
import { Text, Modal, View, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { ColorPicker, fromHsv } from 'react-native-color-picker';
import styled from '@emotion/native';

const Touchable = styled.TouchableOpacity(({ theme, color }) => ({
  borderColor: theme.borderColor,
  width: 30,
  height: 20,
  borderRadius: 2,
  borderWidth: 1,
  margin: 10,
  backgroundColor: color,
}));

class ColorType extends React.Component {
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

  onChangeColor = color => {
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

ColorType.propTypes = {
  knob: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.string,
  }),
  onChange: PropTypes.func,
};
ColorType.defaultProps = {
  knob: {},
  onChange: value => value,
};

ColorType.serialize = value => value;
ColorType.deserialize = value => value;

export default ColorType;
