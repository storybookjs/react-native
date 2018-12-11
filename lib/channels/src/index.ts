export interface ChannelTransport {
  send: any; // todo Check actual type
  setHandler<TEventArgs = any>(handler: (event: ChannelEvent<TEventArgs>) => void): void;
}

export interface ChannelEvent<TEventArgs = any> {
  type: string;
  from: string;
  args: TEventArgs[];
}

export interface Listener<TEventArgs = any> {
  (...args: TEventArgs[]): void;
  ignorePeer?: boolean;
}

interface ListenersKeyValue {
  [key: string]: Listener[];
}

interface ChannelArgs {
  transport?: ChannelTransport;
  async?: boolean;
}

const generateRandomId = () => {
  // generates a random 13 character string
  return Math.random()
    .toString(16)
    .slice(2);
};

export class Channel {
  private _sender = generateRandomId();
  private _listeners: ListenersKeyValue = {};
  private readonly _async: boolean = false;
  private readonly _transport: ChannelTransport;

  constructor({ transport, async }: ChannelArgs = {}) {
    this._async = async;
    if (transport) {
      this._transport = transport;
      this._transport.setHandler(event => this._handleEvent(event));
    }
  }

  addListener(type: string, listener: Listener) {
    this.on(type, listener);
  }

  addPeerListener(type: string, listener: Listener) {
    const peerListener = listener;
    peerListener.ignorePeer = true;
    this.on(type, peerListener);
  }

  emit<TEventArgs = any>(type: string, ...args: TEventArgs[]) {
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

  listenerCount(type: string) {
    const listeners = this._listeners[type];
    return listeners ? listeners.length : 0;
  }

  listeners(type: string) {
    return this._listeners[type];
  }

  on(type: string, listener: Listener) {
    this._listeners[type] = this._listeners[type] || [];
    this._listeners[type].push(listener);
  }

  once(type: string, listener: Listener) {
    const onceListener = this._onceListener(type, listener);
    this.on(type, onceListener);
  }

  prependListener(type: string, listener: Listener) {
    this._listeners[type] = this._listeners[type] || [];
    this._listeners[type].unshift(listener);
  }

  prependOnceListener(type: string, listener: Listener) {
    const onceListener = this._onceListener(type, listener);
    this.prependListener(type, onceListener);
  }

  removeAllListeners(type: string) {
    if (!type) {
      this._listeners = {};
    } else if (this._listeners[type]) {
      delete this._listeners[type];
    }
  }

  removeListener(type: string, listener: Listener) {
    const listeners = this._listeners[type];
    if (listeners) {
      this._listeners[type] = listeners.filter(l => l !== listener);
    }
  }

  hasTransport() {
    return !!this._transport;
  }

  private _handleEvent(event: ChannelEvent, isPeer = false) {
    const listeners = this._listeners[event.type];
    if (listeners && (isPeer || event.from !== this._sender)) {
      listeners.forEach(fn => !(isPeer && fn.ignorePeer) && fn(...event.args));
    }
  }

  private _onceListener(type: string, listener: Listener) {
    const onceListener = (...args: any[]) => {
      this.removeListener(type, onceListener);
      return listener(...args);
    };
    return onceListener;
  }
}

export default Channel;
