import { window, document } from 'global';
import Channel, { ChannelEvent, ChannelHandler } from '@storybook/channels';
import { logger } from '@storybook/client-logger';

import { isJSON, parse, stringify } from 'telejson';

interface RawEvent {
  data: string;
}

interface Config {
  page: 'manager' | 'preview';
}

interface BufferedEvent {
  event: ChannelEvent;
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}

export const KEY = 'storybook-channel';

// TODO: we should export a method for opening child windows here and keep track of em.
// that way we can send postMessage to child windows as well, not just iframe
// https://stackoverflow.com/questions/6340160/how-to-get-the-references-of-all-already-opened-child-windows

export class PostmsgTransport {
  private buffer: BufferedEvent[];
  private handler: ChannelHandler;

  constructor(private readonly config: Config) {
    this.buffer = [];
    this.handler = null;
    window.addEventListener('message', this.handleEvent.bind(this), false);
    document.addEventListener('DOMContentLoaded', () => this.flush());
    // Check whether the config.page parameter has a valid value
    if (config.page !== 'manager' && config.page !== 'preview') {
      throw new Error(`postmsg-channel: "config.page" cannot be "${config.page}"`);
    }
  }

  setHandler(handler: ChannelHandler): void {
    this.handler = handler;
  }

  /**
   * Sends `event` to the associated window. If the window does not yet exist
   * the event will be stored in a buffer and sent when the window exists.
   * @param event
   */
  send(event: ChannelEvent, options?: any): Promise<any> {
    const iframeWindow = this.getWindow();
    if (!iframeWindow) {
      return new Promise((resolve, reject) => {
        this.buffer.push({ event, resolve, reject });
      });
    }
    let depth = 15;
    if (options && Number.isInteger(options.depth)) {
      depth = options.depth;
    }

    const data = stringify({ key: KEY, event }, { maxDepth: depth });

    // TODO: investigate http://blog.teamtreehouse.com/cross-domain-messaging-with-postmessage
    // might replace '*' with document.location ?
    iframeWindow.postMessage(data, '*');
    return Promise.resolve(null);
  }

  private flush(): void {
    const buffer = this.buffer;
    this.buffer = [];
    buffer.forEach(item => {
      this.send(item.event)
        .then(item.resolve)
        .catch(item.reject);
    });
  }

  private getWindow(): Window {
    if (this.config.page === 'manager') {
      // FIXME this is a really bad idea! use a better way to do this.
      // This finds the storybook preview iframe to send messages to.
      const iframe = document.getElementById('storybook-preview-iframe');
      if (!iframe) {
        return null;
      }
      return iframe.contentWindow;
    }
    return window.parent;
  }

  private handleEvent(rawEvent: RawEvent): void {
    try {
      const { data } = rawEvent;
      const { key, event } = typeof data === 'string' && isJSON(data) ? parse(data) : data;
      if (key === KEY) {
        logger.debug(`message arrived at ${this.config.page}`, event.type, ...event.args);
        this.handler(event);
      }
    } catch (error) {
      logger.error(error);
      // debugger;
    }
  }
}

/**
 * Creates a channel which communicates with an iframe or child window.
 */
export default function createChannel({ page }: Config): Channel {
  const transport = new PostmsgTransport({ page });
  return new Channel({ transport });
}
