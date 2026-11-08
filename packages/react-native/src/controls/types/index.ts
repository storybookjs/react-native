import TextType from './Text';
import NumberType from './Number';
import ColorType from './Color';
import BooleanType from './Boolean';
import ObjectType from './Object';
import SelectType from './Select';
import DateType from './Date';
import ArrayType from './Array';
import RadioType from './Radio';
import { ControlTypes } from '../sharedTypes';

export default {
  text: TextType,
  number: NumberType,
  color: ColorType,
  boolean: BooleanType,
  object: ObjectType,
  select: SelectType,
  date: DateType,
  array: ArrayType,
  radio: RadioType,
  'inline-radio': RadioType,
  'multi-select': SelectType,
  range: NumberType,
} satisfies Record<ControlTypes, React.ComponentType<any>>;
