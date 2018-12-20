export type ChannelHandler = (event: ChannelEvent) => void;

export interface ChannelTransport {
  send(event: ChannelEvent): void;
  setHandler(handler: ChannelHandler): void;
}

export interface ChannelEvent {
  type: string; // eventName
  from: string;
  args: any[];
}

export interface Listener {
  (...args: any[]): void;

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

  addListener(eventName: string, listener: Listener) {
    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(listener);
  }

  addPeerListener(eventName: string, listener: Listener) {
    const peerListener = listener;
    peerListener.ignorePeer = true;
    this.addListener(eventName, peerListener);
  }

  emit(eventName: string, ...args: any[]) {
    const event: ChannelEvent = { type: eventName, args, from: this.sender };

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

  once(eventName: string, listener: Listener) {
    const onceListener: Listener = this.onceListener(eventName, listener);
    this.addListener(eventName, onceListener);
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

  on(eventName: string, listener: Listener) {
    this.addListener(eventName, listener);
  }

  private handleEvent(event: ChannelEvent, isPeer = false) {
    const listeners = this.listeners(event.type);
    if (listeners && (isPeer || event.from !== this.sender)) {
      listeners.forEach(fn => !(isPeer && fn.ignorePeer) && fn(...event.args));
    }
  }

  private onceListener(eventName: string, listener: Listener) {
    const onceListener: Listener = (...args: any[]) => {
      this.removeListener(eventName, onceListener);
      return listener(...args);
    };
    return onceListener;
  }
}

export default Channel;
