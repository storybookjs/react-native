export type ChannelHandler<TEventArgs = any> = (event: ChannelEvent<TEventArgs>) => void;

export interface ChannelTransport<TEventArgs = any> {
  send(event: ChannelEvent<TEventArgs>): void;
  setHandler(handler: ChannelHandler<TEventArgs>): void;
}

export interface ChannelEvent<TEventArgs = any> {
  type: string; // eventName
  from: string;
  args: TEventArgs;
}

export interface Listener<TEventArgs = any> {
  (...args: TEventArgs[]): void;

  ignorePeer?: boolean;
}

interface EventsKeyValue {
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
  readonly isAsync: boolean;

  private sender = generateRandomId();
  private events: EventsKeyValue = {};
  private readonly transport: ChannelTransport;

  constructor({ transport, async = false }: ChannelArgs = {}) {
    this.isAsync = async;
    if (transport) {
      this.transport = transport;
      this.transport.setHandler(event => this.handleEvent(event));
    }
  }

  get hasTransport() {
    return !!this.transport;
  }

  addListener<TEventArgs = any>(eventName: string, listener: Listener<TEventArgs>) {
    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(listener);
  }

  addPeerListener<TEventArgs = any>(eventName: string, listener: Listener<TEventArgs>) {
    const peerListener = listener;
    peerListener.ignorePeer = true;
    this.addListener<TEventArgs>(eventName, peerListener);
  }

  emit<TEventArgs = any>(eventName: string, ...args: TEventArgs[]) {
    const event: ChannelEvent<TEventArgs[]> = { type: eventName, args, from: this.sender };

    const handler = () => {
      if (this.transport) {
        this.transport.send(event);
      }
      this.handleEvent(event, true);
    };

    if (this.isAsync) {
      // todo I'm not sure how to test this
      setImmediate(handler);
    } else {
      handler();
    }
  }

  eventNames() {
    return Object.keys(this.events);
  }

  listenerCount(eventName: string) {
    const listeners = this.listeners(eventName);
    return listeners ? listeners.length : 0;
  }

  listeners(eventName: string): Listener[] | undefined {
    const listeners = this.events[eventName];
    return listeners ? listeners : undefined;
  }

  once<TEventArgs = any>(eventName: string, listener: Listener<TEventArgs>) {
    const onceListener: Listener = this.onceListener<TEventArgs>(eventName, listener);
    this.addListener<TEventArgs>(eventName, onceListener);
  }

  removeAllListeners(eventName?: string) {
    if (!eventName) {
      this.events = {};
    } else if (this.events[eventName]) {
      delete this.events[eventName];
    }
  }

  removeListener(eventName: string, listener: Listener) {
    const listeners = this.listeners(eventName);
    if (listeners) {
      this.events[eventName] = listeners.filter(l => l !== listener);
    }
  }

  on<TEventArgs = any>(eventName: string, listener: Listener<TEventArgs>) {
    this.addListener<TEventArgs>(eventName, listener);
  }

  private handleEvent<TEventArgs = any>(event: ChannelEvent<TEventArgs[]>, isPeer = false) {
    const listeners = this.listeners(event.type);
    if (listeners && (isPeer || event.from !== this.sender)) {
      listeners.forEach(fn => !(isPeer && fn.ignorePeer) && fn(...event.args));
    }
  }

  private onceListener<TEventArgs>(eventName: string, listener: Listener<TEventArgs>) {
    const onceListener: Listener<TEventArgs> = (...args: TEventArgs[]) => {
      this.removeListener(eventName, onceListener);
      return listener(...args);
    };
    return onceListener;
  }
}

export default Channel;
