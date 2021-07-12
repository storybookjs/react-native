// credit to https://github.com/instea/react-native-color-picker
import React from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
  InteractionManager,
  I18nManager,
} from 'react-native';
import tinycolor from 'tinycolor2';
import { createPanResponder, rotatePoint } from './utils';

function makeRotationKey(props, angle) {
  const { rotationHackFactor } = props;
  if (rotationHackFactor < 1) {
    return undefined;
  }
  const key = Math.floor(angle * rotationHackFactor);
  return `r${key}`;
}

export class TriangleColorPicker extends React.PureComponent {
  constructor(props, ctx) {
    super(props, ctx);
    const state = {
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
    this._onLayout = this._onLayout.bind(this);
    this._onSValueChange = this._onSValueChange.bind(this);
    this._onVValueChange = this._onVValueChange.bind(this);
    this._onColorSelected = this._onColorSelected.bind(this);
    this._onOldColorSelected = this._onOldColorSelected.bind(this);
    this._isRTL = I18nManager.isRTL;

    this._pickerResponder = createPanResponder({
      onStart: ({ x, y }) => {
        const { s, v } = this._computeColorFromTriangle({ x, y });
        this._changingHColor = s > 1 || s < 0 || v > 1 || v < 0;
        this._handleColorChange({ x, y });
      },
      onMove: this._handleColorChange,
    });

    this.pickerContainer = React.createRef();
  }

  getColor() {
    return tinycolor(this._getColor()).toHexString();
  }

  _handleColorChange = ({ x, y }) => {
    if (this._changingHColor) {
      this._handleHColorChange({ x, y });
    } else {
      this._handleSVColorChange({ x, y });
    }
  };

  _getColor() {
    const passedColor =
      typeof this.props.color === 'string' ? tinycolor(this.props.color).toHsv() : this.props.color;
    return passedColor || this.state.color;
  }

  _onColorSelected() {
    const { onColorSelected } = this.props;
    const color = tinycolor(this._getColor()).toHexString();
    if (onColorSelected) {
      onColorSelected(color);
    }
  }

  _onOldColorSelected() {
    const { oldColor, onOldColorSelected } = this.props;
    const color = tinycolor(oldColor);
    this.setState({ color: color.toHsv() });
    if (onOldColorSelected) {
      onOldColorSelected(color.toHexString());
    }
  }

  _onSValueChange(s) {
    const { h, v } = this._getColor();
    this._onColorChange({ h, s, v });
  }

  _onVValueChange(v) {
    const { h, s } = this._getColor();
    this._onColorChange({ h, s, v });
  }

  _onColorChange(color) {
    this.setState({ color });
    if (this.props.onColorChange) {
      this.props.onColorChange(color);
    }
  }

  _onLayout(l) {
    this._layout = l.nativeEvent.layout;
    const { width, height } = this._layout;
    const pickerSize = Math.min(width, height);
    if (this.state.pickerSize !== pickerSize) {
      this.setState({ pickerSize });
    }
    // layout.x, layout.y is always 0
    // we always measure because layout is the same even though picker is moved on the page
    InteractionManager.runAfterInteractions(() => {
      // measure only after (possible) animation ended
      if (this.pickerContainer.current) {
        this.pickerContainer.current.measure((_x, _y, _width, _height, pageX, pageY) => {
          // picker position in the screen
          this._pageX = pageX;
          this._pageY = pageY;
        });
      }
    });
  }

  _computeHValue(x, y) {
    const mx = this.state.pickerSize / 2;
    const my = this.state.pickerSize / 2;
    const dx = x - mx;
    const dy = y - my;
    const rad = Math.atan2(dx, dy) + Math.PI + Math.PI / 2;
    return ((rad * 180) / Math.PI) % 360;
  }

  _hValueToRad(deg) {
    const rad = (deg * Math.PI) / 180;
    return rad - Math.PI - Math.PI / 2;
  }

  _handleHColorChange({ x, y }) {
    const { s, v } = this._getColor();
    const marginLeft = (this._layout.width - this.state.pickerSize) / 2;
    const marginTop = (this._layout.height - this.state.pickerSize) / 2;
    const relativeX = x - this._pageX - marginLeft;
    const relativeY = y - this._pageY - marginTop;
    const h = this._computeHValue(relativeX, relativeY);
    this._onColorChange({ h, s, v });
  }

  _handleSVColorChange({ x, y }) {
    const { h, s: rawS, v: rawV } = this._computeColorFromTriangle({ x, y });
    const s = Math.min(Math.max(0, rawS), 1);
    const v = Math.min(Math.max(0, rawV), 1);
    this._onColorChange({ h, s, v });
  }

  _normalizeTriangleTouch(s, v, sRatio) {
    const CORNER_ZONE_SIZE = 0.12; // relative size to be considered as corner zone
    const NORMAL_MARGIN = 0.1; // relative triangle margin to be considered as touch in triangle
    const CORNER_MARGIN = 0.05; // relative triangle margin to be considered as touch in triangle in corner zone
    let margin = NORMAL_MARGIN;

    const posNS = v > 0 ? 1 - (1 - s) * sRatio : 1 - s * sRatio;
    const negNS = v > 0 ? s * sRatio : (1 - s) * sRatio;
    const ns = s > 1 ? posNS : negNS; // normalized s value according to ratio and s value

    const rightCorner = s > 1 - CORNER_ZONE_SIZE && v > 1 - CORNER_ZONE_SIZE;
    const leftCorner = ns < 0 + CORNER_ZONE_SIZE && v > 1 - CORNER_ZONE_SIZE;
    const topCorner = ns < 0 + CORNER_ZONE_SIZE && v < 0 + CORNER_ZONE_SIZE;
    if (rightCorner) {
      return { s, v };
    }
    if (leftCorner || topCorner) {
      margin = CORNER_MARGIN;
    }
    let s1 = s;
    let v1 = v;
    // color normalization according to margin
    s1 = s1 < 0 && ns > 0 - margin ? 0 : s1;
    s1 = s1 > 1 && ns < 1 + margin ? 1 : s1;
    v1 = v1 < 0 && v1 > 0 - margin ? 0 : v1;
    v1 = v1 > 1 && v1 < 1 + margin ? 1 : v1;
    return { s1, v1 };
  }

  /**
   * Computes s, v from position (x, y). If position is outside of triangle,
   * it will return invalid values (greater than 1 or lower than 0)
   */
  _computeColorFromTriangle({ x, y }) {
    const { pickerSize } = this.state;
    const { triangleHeight, triangleWidth } = getPickerProperties(pickerSize);

    const left = pickerSize / 2 - triangleWidth / 2;
    const top = pickerSize / 2 - (2 * triangleHeight) / 3;

    // triangle relative coordinates
    const marginLeft = (this._layout.width - this.state.pickerSize) / 2;
    const marginTop = (this._layout.height - this.state.pickerSize) / 2;
    const relativeX = x - this._pageX - marginLeft - left;
    const relativeY = y - this._pageY - marginTop - top;

    // rotation
    const { h } = this._getColor();
    const deg = (h - 330 + 360) % 360; // starting angle is 330 due to comfortable calculation
    const rad = (deg * Math.PI) / 180;
    const center = {
      x: triangleWidth / 2,
      y: (2 * triangleHeight) / 3,
    };
    const rotated = rotatePoint({ x: relativeX, y: relativeY }, rad, center);

    const line = (triangleWidth * rotated.y) / triangleHeight;
    const margin = triangleWidth / 2 - ((triangleWidth / 2) * rotated.y) / triangleHeight;
    const s = (rotated.x - margin) / line;
    const v = rotated.y / triangleHeight;

    // normalize
    const normalized = this._normalizeTriangleTouch(s, v, line / triangleHeight);

    return { h, s: normalized.s, v: normalized.v };
  }

  render() {
    const { pickerSize } = this.state;
    const { oldColor, style } = this.props;
    const color = this._getColor();
    const { h } = color;
    const angle = this._hValueToRad(h);
    const selectedColor = tinycolor(color).toHexString();
    const indicatorColor = tinycolor({ h, s: 1, v: 1 }).toHexString();
    const computed = makeComputedStyles({
      pickerSize,
      selectedColor,
      selectedColorHsv: color,
      indicatorColor,
      oldColor,
      angle,
      isRTL: this._isRTL,
    });
    // Hack for https://github.com/instea/react-native-color-picker/issues/17
    const rotationHack = makeRotationKey(this.props, angle);
    return (
      <View style={style}>
        <View onLayout={this._onLayout} ref={this.pickerContainer} style={styles.pickerContainer}>
          {!pickerSize ? null : (
            <View>
              <View
                key={rotationHack}
                style={[styles.triangleContainer, computed.triangleContainer]}
              >
                <View
                  style={[styles.triangleUnderlayingColor, computed.triangleUnderlayingColor]}
                />
                <Image
                  style={[styles.triangleImage, computed.triangleImage]}
                  source={require('./resources/hsv_triangle_mask.png')}
                />
              </View>
              <View
                {...this._pickerResponder.panHandlers}
                style={[styles.picker, computed.picker]}
                collapsable={false}
              >
                <Image
                  source={require('./resources/color-circle.png')}
                  resizeMode="contain"
                  style={[styles.pickerImage]}
                />
                <View key={rotationHack} style={[styles.pickerIndicator, computed.pickerIndicator]}>
                  <View style={[styles.pickerIndicatorTick, computed.pickerIndicatorTick]} />
                </View>
                <View style={[styles.svIndicator, computed.svIndicator]} />
              </View>
            </View>
          )}
        </View>
        <View style={[styles.colorPreviews, computed.colorPreviews]}>
          {oldColor && (
            <TouchableOpacity
              style={[styles.colorPreview, { backgroundColor: oldColor }]}
              onPress={this._onOldColorSelected}
              activeOpacity={0.7}
            />
          )}
          <TouchableOpacity
            style={[styles.colorPreview, { backgroundColor: selectedColor }]}
            onPress={this._onColorSelected}
            activeOpacity={0.7}
          />
        </View>
      </View>
    );
  }
}

TriangleColorPicker.propTypes = {
  color: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      h: PropTypes.number,
      s: PropTypes.number,
      v: PropTypes.number,
    }),
  ]),
  defaultColor: PropTypes.string,
  oldColor: PropTypes.string,
  onColorChange: PropTypes.func,
  onColorSelected: PropTypes.func,
  onOldColorSelected: PropTypes.func,
  rotationHackFactor: PropTypes.number,
  style: {},
};

TriangleColorPicker.defaultProps = {
  rotationHackFactor: 100,
};

function getPickerProperties(pickerSize) {
  const indicatorPickerRatio = 42 / 510; // computed from picker image
  const originalIndicatorSize = indicatorPickerRatio * pickerSize;
  const indicatorSize = originalIndicatorSize;
  const pickerPadding = originalIndicatorSize / 3;

  const triangleSize = pickerSize - 6 * pickerPadding;
  const triangleRadius = triangleSize / 2;
  const triangleHeight = (triangleRadius * 3) / 2;
  const triangleWidth = 2 * triangleRadius * Math.sqrt(3 / 4); // pythagorean theorem

  return {
    triangleSize,
    triangleRadius,
    triangleHeight,
    triangleWidth,
    indicatorPickerRatio,
    indicatorSize,
    pickerPadding,
  };
}

const makeComputedStyles = ({ indicatorColor, angle, pickerSize, selectedColorHsv, isRTL }) => {
  const { triangleSize, triangleHeight, triangleWidth, indicatorSize, pickerPadding } =
    getPickerProperties(pickerSize);

  /* ===== INDICATOR ===== */
  const indicatorRadius = pickerSize / 2 - indicatorSize / 2 - pickerPadding;
  const mx = pickerSize / 2;
  const my = pickerSize / 2;
  const dx = Math.cos(angle) * indicatorRadius;
  const dy = Math.sin(angle) * indicatorRadius;

  /* ===== TRIANGLE ===== */
  const triangleTop = pickerPadding * 3;
  const triangleLeft = pickerPadding * 3;
  const triangleAngle = -angle + Math.PI / 3;

  /* ===== SV INDICATOR ===== */
  const markerColor = 'rgba(0,0,0,0.8)';
  const { s, v, h } = selectedColorHsv;
  const svIndicatorSize = 18;
  const svY = v * triangleHeight;
  const margin = triangleWidth / 2 - v * (triangleWidth / 2);
  const svX = s * (triangleWidth - 2 * margin) + margin;
  const svIndicatorMarginLeft = (pickerSize - triangleWidth) / 2;
  const svIndicatorMarginTop = (pickerSize - (4 * triangleHeight) / 3) / 2;

  const deg = (h - 330 + 360) % 360; // starting angle is 330 due to comfortable calculation
  const rad = (deg * Math.PI) / 180;
  const center = { x: pickerSize / 2, y: pickerSize / 2 };
  const notRotatedPoint = {
    x: svIndicatorMarginTop + svY,
    y: svIndicatorMarginLeft + svX,
  };
  const svIndicatorPoint = rotatePoint(notRotatedPoint, rad, center);

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
      transform: [
        {
          rotate: `${-angle}rad`,
        },
      ],
    },
    pickerIndicatorTick: {
      height: indicatorSize / 2,
      backgroundColor: markerColor,
    },
    svIndicator: {
      top: svIndicatorPoint.x - svIndicatorSize / 2,
      [isRTL ? 'right' : 'left']: svIndicatorPoint.y - svIndicatorSize / 2,
      width: svIndicatorSize,
      height: svIndicatorSize,
      borderRadius: svIndicatorSize / 2,
      borderColor: markerColor,
    },
    triangleContainer: {
      width: triangleSize,
      height: triangleSize,
      transform: [
        {
          rotate: `${triangleAngle}rad`,
        },
      ],
      top: triangleTop,
      left: triangleLeft,
    },
    triangleImage: {
      width: triangleWidth,
      height: triangleHeight,
    },
    triangleUnderlayingColor: {
      left: (triangleSize - triangleWidth) / 2,
      borderLeftWidth: triangleWidth / 2,
      borderRightWidth: triangleWidth / 2,
      borderBottomWidth: triangleHeight,
      borderBottomColor: indicatorColor,
    },
    colorPreviews: {
      height: pickerSize * 0.1, // responsive height
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
    width: null,
    height: null,
  },
  pickerIndicator: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  triangleContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  triangleUnderlayingColor: {
    position: 'absolute',
    top: 0,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  pickerAlignment: {
    alignItems: 'center',
  },
  svIndicator: {
    position: 'absolute',
    borderWidth: 4,
  },
  pickerIndicatorTick: {
    width: 5,
  },
  colorPreviews: {
    flexDirection: 'row',
  },
  colorPreview: {
    flex: 1,
  },
});
