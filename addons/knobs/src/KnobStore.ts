import Types, {
  TextTypeKnob,
  NumberTypeKnob,
  ColorTypeKnob,
  BooleanTypeKnob,
  ObjectTypeKnob,
  SelectTypeKnob,
  RadiosTypeKnob,
  ArrayTypeKnob,
  DateTypeKnob,
  ButtonTypeOnClickProp,
  FileTypeKnob,
  OptionsTypeKnob,
} from './components/types';

type Callback = () => any;

export type KnobType = keyof typeof Types;

type KnobPlus<T extends KnobType, K> = K & { type: T; groupId?: string };

export type Knob<T extends KnobType = any> = T extends 'text'
  ? KnobPlus<T, Pick<TextTypeKnob, 'value'>>
  : T extends 'boolean'
  ? KnobPlus<T, Pick<BooleanTypeKnob, 'value'>>
  : T extends 'number'
  ? KnobPlus<T, Pick<NumberTypeKnob, 'value' | 'range' | 'min' | 'max' | 'step'>>
  : T extends 'color'
  ? KnobPlus<T, Pick<ColorTypeKnob, 'value'>>
  : T extends 'object'
  ? KnobPlus<T, Pick<ObjectTypeKnob<any>, 'value'>>
  : T extends 'select'
  ? KnobPlus<T, Pick<SelectTypeKnob, 'value' | 'options'> & { selectV2: true }>
  : T extends 'radios'
  ? KnobPlus<T, Pick<RadiosTypeKnob, 'value' | 'options'>>
  : T extends 'array'
  ? KnobPlus<T, Pick<ArrayTypeKnob, 'value' | 'separator'>>
  : T extends 'date'
  ? KnobPlus<T, Pick<DateTypeKnob, 'value'>>
  : T extends 'files'
  ? KnobPlus<T, Pick<FileTypeKnob, 'value' | 'accept'>>
  : T extends 'button'
  ? KnobPlus<T, { value?: never; callback: ButtonTypeOnClickProp; hideLabel: true }>
  : T extends 'options'
  ? KnobPlus<T, Pick<OptionsTypeKnob<any>, 'options' | 'value' | 'optionsObj'>>
  : never;

export type KnobStoreKnob = Knob & {
  name: string;
  label: string;
  used?: boolean;
  defaultValue?: any;
  hideLabel?: boolean;
  callback?: () => any;
};

const callArg = (fn: Callback) => fn();
const callAll = (fns: Callback[]) => fns.forEach(callArg);

export default class KnobStore {
  store: Record<string, KnobStoreKnob> = {};

  callbacks: Callback[] = [];

  timer: NodeJS.Timeout;

  has(key: string) {
    return this.store[key] !== undefined;
  }

  set(key: string, value: KnobStoreKnob) {
    this.store[key] = {
      ...value,
      used: true,
      groupId: value.groupId,
    };

    // debounce the execution of the callbacks for 50 milliseconds
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(callAll, 50, this.callbacks);
  }

  get(key: string) {
    const knob = this.store[key];
    if (knob) {
      knob.used = true;
    }
    return knob;
  }

  getAll() {
    return this.store;
  }

  reset() {
    this.store = {};
  }

  markAllUnused() {
    Object.keys(this.store).forEach(knobName => {
      this.store[knobName].used = false;
    });
  }

  subscribe(cb: Callback) {
    this.callbacks.push(cb);
  }

  unsubscribe(cb: Callback) {
    const index = this.callbacks.indexOf(cb);
    this.callbacks.splice(index, 1);
  }
}
