import * as React from 'react';

type HsvColor = { h: number; s: number; v: number };

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

export const ColorPicker: React.ComponentType<IHoloPicker>;
export const TriangleColorPicker: React.ComponentType<IPicker>;
export const toHsv: (color: string) => HsvColor;
export const fromHsv: (hsv: HsvColor) => string;
