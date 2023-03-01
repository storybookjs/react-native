import PropTypes from 'prop-types';
import React from 'react';
import { Text, Modal, View, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import styled from '@emotion/native';
import { ColorPicker, fromHsv } from '../components/color-picker';

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

const Touchable = styled.TouchableOpacity(({ theme, color }) => ({
  width: '100%',
  height: '100%',
  borderRadius: theme.inputs.swatch.innerBorderRadius,
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

  onChangeColor = (color) => {
    const { onChange } = this.props;

    onChange(fromHsv(color));
  };

  render() {
    const { knob } = this.props;
    const { displayColorPicker } = this.state;
    return (
      <View>
        <TouchableContainer>
          <Touchable color={knob.value} onPress={this.openColorPicker} />
        </TouchableContainer>
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
  onChange: (value) => value,
};

ColorType.serialize = (value) => value;
ColorType.deserialize = (value) => value;

export default ColorType;
