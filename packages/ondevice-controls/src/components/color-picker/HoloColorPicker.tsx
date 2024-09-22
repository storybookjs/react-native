import Slider from '@react-native-community/slider';
import { PureComponent, createRef } from 'react';
import {
  I18nManager,
  Image,
  InteractionManager,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import tinycolor, { ColorFormats } from 'tinycolor2';
import { createPanResponder } from './utils';

interface HoloColorPickerProps {
  color?: string | ColorFormats.HSV;
  defaultColor?: string;
  oldColor?: string;
  onColorChange?: (color: ColorFormats.HSV) => void;
  onColorSelected?: (color: string) => void;
  onOldColorSelected?: (color: string) => void;
  hideSliders?: boolean;
  style?: ViewStyle;
}

interface HoloColorPickerState {
  color: ColorFormats.HSV;
  pickerSize: number | null;
}

export class HoloColorPicker extends PureComponent<HoloColorPickerProps, HoloColorPickerState> {
  private _layout: { width: number; height: number; x: number; y: number };
  private _pageX: number;
  private _pageY: number;
  private _isRTL: boolean;
  private _pickerResponder: any;
  private pickerContainer = createRef<View>();

  constructor(props: HoloColorPickerProps) {
    super(props);
    const state: HoloColorPickerState = {
      color: { h: 0, s: 1, v: 1 },
      pickerSize: null,
    };
    if (props.oldColor) {
      state.color = tinycolor(props.oldColor).toHsv();
    }
    if (props.defaultColor) {
      state.color = tinycolor(props.defaultColor).toHsv();
    }
    this.state = state;
    this._layout = { width: 0, height: 0, x: 0, y: 0 };
    this._pageX = 0;
    this._pageY = 0;
    this._isRTL = I18nManager.isRTL;
    this._pickerResponder = createPanResponder({
      onStart: this._handleColorChange,
      onMove: this._handleColorChange,
    });
  }

  getColor() {
    return tinycolor(this._getColor()).toHexString();
  }

  _handleColorChange = ({ x, y }: { x: number; y: number }) => {
    const { s, v } = this._getColor();
    const marginLeft = (this._layout.width - (this.state.pickerSize ?? 0)) / 2;
    const marginTop = (this._layout.height - (this.state.pickerSize ?? 0)) / 2;
    const relativeX = x - this._pageX - marginLeft;
    const relativeY = y - this._pageY - marginTop;
    const h = this._computeHValue(relativeX, relativeY);
    this._onColorChange({ h, s, v });
  };

  _onSValueChange = (s: number) => {
    const { h, v } = this._getColor();
    this._onColorChange({ h, s, v });
  };

  _onVValueChange = (v: number) => {
    const { h, s } = this._getColor();
    this._onColorChange({ h, s, v });
  };

  _onColorChange = (color: ColorFormats.HSV) => {
    this.setState({ color });
    if (this.props.onColorChange) {
      this.props.onColorChange(color);
    }
  };

  _onLayout = (l: LayoutChangeEvent) => {
    this._layout = l.nativeEvent.layout;
    const { width, height } = this._layout;
    const pickerSize = Math.min(width, height);
    if (this.state.pickerSize !== pickerSize) {
      this.setState({ pickerSize });
    }
    InteractionManager.runAfterInteractions(() => {
      if (this.pickerContainer.current) {
        this.pickerContainer.current.measure((_x, _y, _width, _height, pageX, pageY) => {
          this._pageX = pageX;
          this._pageY = pageY;
        });
      }
    });
  };

  _getColor() {
    const passedColor =
      typeof this.props.color === 'string' ? tinycolor(this.props.color).toHsv() : this.props.color;
    return passedColor || this.state.color;
  }

  _onColorSelected = () => {
    const { onColorSelected } = this.props;
    const color = tinycolor(this._getColor()).toHexString();
    if (onColorSelected) {
      onColorSelected(color);
    }
  };

  _onOldColorSelected = () => {
    const { oldColor, onOldColorSelected } = this.props;
    const color = tinycolor(oldColor!);
    this.setState({ color: color.toHsv() });
    if (onOldColorSelected) {
      onOldColorSelected(color.toHexString());
    }
  };

  _computeHValue(x: number, y: number) {
    const mx = (this.state.pickerSize ?? 0) / 2;
    const my = (this.state.pickerSize ?? 0) / 2;
    const dx = x - mx;
    const dy = y - my;
    const rad = Math.atan2(dx, dy) + Math.PI + Math.PI / 2;
    return ((rad * 180) / Math.PI) % 360;
  }

  _hValueToRad(deg: number) {
    const rad = (deg * Math.PI) / 180;
    return rad - Math.PI - Math.PI / 2;
  }

  render() {
    const { pickerSize } = this.state;
    const { oldColor, style } = this.props;
    const color = this._getColor();
    const { h, s, v } = color;
    const angle = this._hValueToRad(h);
    const selectedColor = tinycolor(color).toHexString();
    const indicatorColor = tinycolor({ h, s: 1, v: 1 }).toHexString();
    const computed = makeComputedStyles({
      pickerSize: pickerSize ?? 0,
      selectedColor,
      indicatorColor,
      oldColor,
      angle,
      isRTL: this._isRTL,
    });
    return (
      <View style={style}>
        <View onLayout={this._onLayout} ref={this.pickerContainer} style={styles.pickerContainer}>
          {!pickerSize ? null : (
            <View>
              <View
                {...this._pickerResponder.panHandlers}
                style={[computed.picker]}
                collapsable={false}
              >
                <Image
                  source={require('./resources/color-circle.png')}
                  resizeMode="contain"
                  style={[styles.pickerImage]}
                />
                <View style={[styles.pickerIndicator, computed.pickerIndicator]} />
              </View>
              {oldColor && (
                <TouchableOpacity
                  style={[styles.selectedPreview, computed.selectedPreview]}
                  onPress={this._onColorSelected}
                  activeOpacity={0.7}
                />
              )}
              {oldColor && (
                <TouchableOpacity
                  style={[styles.originalPreview, computed.originalPreview]}
                  onPress={this._onOldColorSelected}
                  activeOpacity={0.7}
                />
              )}
              {!oldColor && (
                <TouchableOpacity
                  style={[styles.selectedFullPreview, computed.selectedFullPreview]}
                  onPress={this._onColorSelected}
                  activeOpacity={0.7}
                />
              )}
            </View>
          )}
        </View>
        {this.props.hideSliders ? null : (
          <View>
            <Text style={{ paddingStart: 4, color: '#859499', fontSize: 12 }}>Saturation</Text>
            <Slider value={s} onValueChange={this._onSValueChange} />
            <Text style={{ paddingStart: 4, color: '#859499', fontSize: 12 }}>Lightness</Text>
            <Slider value={v} onValueChange={this._onVValueChange} />
          </View>
        )}
      </View>
    );
  }
}

const makeComputedStyles = ({
  indicatorColor,
  selectedColor,
  oldColor,
  angle,
  pickerSize,
  isRTL,
}: {
  indicatorColor: string;
  selectedColor: string;
  oldColor?: string;
  angle: number;
  pickerSize: number;
  isRTL: boolean;
}) => {
  const summarySize = 0.5 * pickerSize;
  const indicatorPickerRatio = 42 / 510;
  const indicatorSize = indicatorPickerRatio * pickerSize;
  const pickerPadding = indicatorSize / 3;
  const indicatorRadius = pickerSize / 2 - indicatorSize / 2 - pickerPadding;
  const mx = pickerSize / 2;
  const my = pickerSize / 2;
  const dx = Math.cos(angle) * indicatorRadius;
  const dy = Math.sin(angle) * indicatorRadius;
  return {
    picker: {
      padding: pickerPadding,
      width: pickerSize,
      height: pickerSize,
    },
    pickerIndicator: {
      top: mx + dx - indicatorSize / 2,
      [isRTL ? 'right' : 'left']: my + dy - indicatorSize / 2,
      width: indicatorSize,
      height: indicatorSize,
      borderRadius: indicatorSize / 2,
      backgroundColor: indicatorColor,
    },
    selectedPreview: {
      width: summarySize / 2,
      height: summarySize,
      top: pickerSize / 2 - summarySize / 2,
      left: Math.floor(pickerSize / 2),
      borderTopRightRadius: summarySize / 2,
      borderBottomRightRadius: summarySize / 2,
      backgroundColor: selectedColor,
    },
    originalPreview: {
      width: Math.ceil(summarySize / 2),
      height: summarySize,
      top: pickerSize / 2 - summarySize / 2,
      left: pickerSize / 2 - summarySize / 2,
      borderTopLeftRadius: summarySize / 2,
      borderBottomLeftRadius: summarySize / 2,
      backgroundColor: oldColor,
    },
    selectedFullPreview: {
      width: summarySize,
      height: summarySize,
      top: pickerSize / 2 - summarySize / 2,
      left: pickerSize / 2 - summarySize / 2,
      borderRadius: summarySize / 2,
      backgroundColor: selectedColor,
    },
  };
};

const styles = StyleSheet.create({
  pickerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerImage: {
    flex: 1,
    width: undefined,
    height: undefined,
  },
  pickerIndicator: {
    position: 'absolute',
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowOffset: { width: 3, height: 3 },
    shadowRadius: 4,
    elevation: 5,
  },
  selectedPreview: {
    position: 'absolute',
    borderLeftWidth: 0,
  },
  originalPreview: {
    position: 'absolute',
    borderRightWidth: 0,
  },
  selectedFullPreview: {
    position: 'absolute',
  },
  pickerAlignment: {
    alignItems: 'center',
  },
});
