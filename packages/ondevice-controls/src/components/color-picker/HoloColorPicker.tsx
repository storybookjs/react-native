import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  I18nManager,
  Image,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import tinycolor, { ColorFormats } from 'tinycolor2';
import SliderWrapper from '../SliderWrapper';
import { createPanResponder } from './utils';

interface HoloColorPickerProps {
  defaultColor: string;
  oldColor?: string;
  onColorChange: (color: ColorFormats.HSV) => void;
  style?: ViewStyle;
}

const getHsv = (color: string): ColorFormats.HSV => tinycolor(color).toHsv();

export function HoloColorPicker({
  defaultColor,
  oldColor,
  onColorChange,
  style,
}: HoloColorPickerProps) {
  const [color, setColor] = useState(() => getHsv(defaultColor));
  const [pickerSize, setPickerSize] = useState(0);
  const colorRef = useRef(color);
  const pickerSizeRef = useRef(pickerSize);
  const pickerRef = useRef<View>(null);
  const pickerPageOffsetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const nextColor = getHsv(defaultColor);
    colorRef.current = nextColor;
    setColor(nextColor);
  }, [defaultColor]);

  const updateColor = useCallback(
    (nextColor: ColorFormats.HSV) => {
      colorRef.current = nextColor;
      setColor(nextColor);
      onColorChange(nextColor);
    },
    [onColorChange]
  );

  const handleHueChange = useCallback(
    ({ x, y }: { x: number; y: number }) => {
      const currentPickerSize = pickerSizeRef.current;
      if (!currentPickerSize) {
        return;
      }

      const relativeX = x - pickerPageOffsetRef.current.x;
      const relativeY = y - pickerPageOffsetRef.current.y;
      const h = computeHue(relativeX, relativeY, currentPickerSize);
      updateColor({ ...colorRef.current, h });
    },
    [updateColor]
  );

  const pickerResponder = useMemo(
    () =>
      createPanResponder({
        onStart: handleHueChange,
        onMove: handleHueChange,
      }),
    [handleHueChange]
  );

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    const nextPickerSize = Math.min(width, height);
    pickerSizeRef.current = nextPickerSize;
    setPickerSize(nextPickerSize);
  };

  const onPickerLayout = () => {
    requestAnimationFrame(() => {
      pickerRef.current?.measure((_x, _y, _width, _height, pageX, pageY) => {
        pickerPageOffsetRef.current = { x: pageX, y: pageY };
      });
    });
  };

  const selectedColor = tinycolor(color).toHexString();
  const indicatorColor = tinycolor({ h: color.h, s: 1, v: 1 }).toHexString();
  const computed = makeComputedStyles({
    pickerSize,
    selectedColor,
    indicatorColor,
    oldColor,
    angle: hueToRad(color.h),
    isRTL: I18nManager.isRTL,
  });

  return (
    <View style={style}>
      <View onLayout={onLayout} style={styles.pickerContainer}>
        {!pickerSize ? null : (
          <View>
            <View
              ref={pickerRef}
              onLayout={onPickerLayout}
              {...pickerResponder.panHandlers}
              style={computed.picker}
              collapsable={false}
            >
              <Image
                source={require('./resources/color-circle.png')}
                resizeMode="contain"
                style={styles.pickerImage}
              />
              <View
                style={[styles.pickerIndicator, computed.pickerIndicator]}
                pointerEvents="none"
              />
            </View>
            {oldColor ? (
              <>
                <View
                  style={[styles.selectedPreview, computed.selectedPreview]}
                  pointerEvents="none"
                />
                <View
                  style={[styles.originalPreview, computed.originalPreview]}
                  pointerEvents="none"
                />
              </>
            ) : (
              <View
                style={[styles.selectedFullPreview, computed.selectedFullPreview]}
                pointerEvents="none"
              />
            )}
          </View>
        )}
      </View>
      <View>
        <Text style={styles.sliderLabel}>Saturation</Text>
        <SliderWrapper
          value={color.s}
          onValueChange={(s) => updateColor({ ...colorRef.current, s })}
        />
        <Text style={styles.sliderLabel}>Lightness</Text>
        <SliderWrapper
          value={color.v}
          onValueChange={(v) => updateColor({ ...colorRef.current, v })}
        />
      </View>
    </View>
  );
}

const computeHue = (x: number, y: number, pickerSize: number) => {
  const center = pickerSize / 2;
  const dx = x - center;
  const dy = y - center;
  const rad = Math.atan2(dx, dy) + Math.PI + Math.PI / 2;
  return ((rad * 180) / Math.PI) % 360;
};

const hueToRad = (deg: number) => {
  const rad = (deg * Math.PI) / 180;
  return rad - Math.PI - Math.PI / 2;
};

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
  const indicatorSize = (42 / 510) * pickerSize;
  const pickerPadding = indicatorSize / 3;
  const indicatorRadius = pickerSize / 2 - indicatorSize / 2 - pickerPadding;
  const center = pickerSize / 2;
  const dx = Math.cos(angle) * indicatorRadius;
  const dy = Math.sin(angle) * indicatorRadius;

  return {
    picker: {
      padding: pickerPadding,
      width: pickerSize,
      height: pickerSize,
    },
    pickerIndicator: {
      top: center + dx - indicatorSize / 2,
      [isRTL ? 'right' : 'left']: center + dy - indicatorSize / 2,
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
    boxShadow: '3px 3px 4px 0px rgba(0, 0, 0, 0.3)',
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
  sliderLabel: {
    paddingStart: 4,
    color: '#859499',
    fontSize: 12,
  },
});
