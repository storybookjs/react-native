/* eslint no-underscore-dangle: 0 */

export default class Channel {
  constructor({ transport, async } = {}) {
    this._sender = this._randomId();
    this._async = async;
    if (transport) {
      this._transport = transport;
      this._transport.setHandler(event => this._handleEvent(event));
    }
    this._listeners = {};
  }

  addListener(type, listener) {
    this.on(type, listener);
  }

  addPeerListener(type, listener) {
    const peerListener = listener;
    peerListener.ignorePeer = true;
    this.on(type, peerListener);
  }

  emit(type, ...args) {
    const event = { type, args, from: this._sender };

    const handler = () => {
      if (this._transport) {
        this._transport.send(event);
      }
      this._handleEvent(event, true);
    };

    if (this._async) {
      setImmediate(handler);
    } else {
      handler();
    }
  }

  eventNames() {
    return Object.keys(this._listeners);
  }

  listenerCount(type) {
    const listeners = this._listeners[type];
    return listeners ? listeners.length : 0;
  }

  listeners(type) {
    return this._listeners[type];
  }

  on(type, listener) {
    this._listeners[type] = this._listeners[type] || [];
    this._listeners[type].push(listener);
  }

  once(type, listener) {
    const onceListener = this._onceListener(type, listener);
    this.on(type, onceListener);
  }

  prependListener(type, listener) {
    this._listeners[type] = this._listeners[type] || [];
    this._listeners[type].unshift(listener);
  }

  prependOnceListener(type, listener) {
    const onceListener = this._onceListener(type, listener);
    this.prependListener(type, onceListener);
  }

  removeAllListeners(type) {
    if (!type) {
      this._listeners = {};
    } else if (this._listeners[type]) {
      delete this._listeners[type];
    }
  }

  removeListener(type, listener) {
    const listeners = this._listeners[type];
    if (listeners) {
      this._listeners[type] = listeners.filter(l => l !== listener);
    }
  }

  _randomId() {
    // generates a random 13 character string
    return Math.random()
      .toString(16)
      .slice(2);
  }

  _handleEvent(event, isPeer) {
    const listeners = this._listeners[event.type];
    if (listeners && (isPeer || event.from !== this._sender)) {
      listeners.forEach(fn => !(isPeer && fn.ignorePeer) && fn(...event.args));
    }
  }

  _onceListener(type, listener) {
    const onceListener = (...args) => {
      this.removeListener(type, onceListener);
      return listener(...args);
    };
    return onceListener;
  }
}
