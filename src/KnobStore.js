export default class KnobStore {
  constructor() {
    this.store = {};
  }

  has(key) {
    return this.store[key] !== undefined;
  }

  set(key, value) {
    this.store[key] = value;
  }

  get(key) {
    return this.store[key];
  }

  getAll() {
    return this.store;
  }

  reset() {
    this.store = {};
  }
}
