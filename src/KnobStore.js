export default class KnobStore {
  constructor() {
    this.store = {};
    this.callbacks = [];
  }

  has(key) {
    return this.store[key] !== undefined;
  }

  set(key, value) {
    this.store[key] = value;
    this.callbacks.forEach(cb => cb());
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

  subscribe(cb) {
    this.callbacks.push(cb);
  }

  unsubscribe(cb) {
    const index = this.callbacks.indexOf(cb);
    this.callbacks.splice(index, 1);
  }
}
