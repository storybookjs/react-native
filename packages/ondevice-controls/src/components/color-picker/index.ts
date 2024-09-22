// credit to https://github.com/instea/react-native-color-picker
export { fromHsv, toHsv } from './utils';
export { HoloColorPicker as ColorPicker } from './HoloColorPicker';
export { TriangleColorPicker } from './TriangleColorPicker';
export type HsvColor = { h: number; s: number; v: number };

export interface IPicker {
  color?: string | HsvColor;
  defaultColor?: string | HsvColor;
  oldColor?: string;
  style?: object;
  onColorSelected?: (selectedColor: string) => void;
  onColorChange?: (selectedColor: HsvColor) => void;
  onOldColorSelected?: (oldColor: string) => void;
  hideSliders?: boolean;
}

export interface SliderProps {
  onValueChange?: (value: number) => void;
  value?: number;
}
export interface IHoloPicker extends IPicker {
  sliderComponent?: React.Component<SliderProps>;
}
