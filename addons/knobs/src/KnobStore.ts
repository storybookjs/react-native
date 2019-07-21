import { Knob } from './type-defs';

type Callback = () => any;

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

  timer: number | undefined;

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
    this.timer = setTimeout(callAll, 50, this.callbacks) as number;
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
