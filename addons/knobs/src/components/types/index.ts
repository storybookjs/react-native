import TextType from './Text';
import NumberType from './Number';
import ColorType from './Color';
import BooleanType from './Boolean';
import ObjectType from './Object';
import SelectType from './Select';
import RadiosType from './Radio';
import ArrayType from './Array';
import DateType from './Date';
import ButtonType from './Button';
import FilesType from './Files';
import OptionsType from './Options';

export default {
  text: TextType,
  number: NumberType,
  color: ColorType,
  boolean: BooleanType,
  object: ObjectType,
  select: SelectType,
  radios: RadiosType,
  array: ArrayType,
  date: DateType,
  button: ButtonType,
  files: FilesType,
  options: OptionsType,
};

export { TextTypeKnob } from './Text';
export { NumberTypeKnob, NumberTypeKnobOptions } from './Number';
export { ColorTypeKnob } from './Color';
export { BooleanTypeKnob } from './Boolean';
export { ObjectTypeKnob } from './Object';
export { SelectTypeKnob, SelectTypeOptionsProp } from './Select';
export { RadiosTypeKnob, RadiosTypeOptionsProp } from './Radio';
export { ArrayTypeKnob } from './Array';
export { DateTypeKnob } from './Date';
export { ButtonTypeKnob, ButtonTypeOnClickProp } from './Button';
export { FileTypeKnob } from './Files';
export { OptionsTypeKnob, OptionsTypeOptionsProp, OptionsKnobOptions } from './Options';
