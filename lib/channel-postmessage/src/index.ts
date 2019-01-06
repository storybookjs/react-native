/* eslint-disable no-underscore-dangle */

import { window, document } from 'global';
import Channel, { ChannelEvent, ChannelHandler } from '@storybook/channels';
import stringify from 'json-stringify-safe';

interface RawEvent {
  data: string;
}

export interface Config {
  page: 'manager' | 'preview';
}

export const KEY = 'storybook-channel';

export class PostmsgTransport {
  private config: Config;
  private buffer: any[];
  private handler: ChannelHandler;

  constructor(config: Config) {
    this.config = config;
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

  send(event: ChannelEvent): Promise<any> {
    const iframeWindow = this._getWindow();
    if (!iframeWindow) {
      return new Promise((resolve, reject) => {
        this.buffer.push({ event, resolve, reject });
      });
    }
    const data = stringify({ key: KEY, event });
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

  getWindow(): Window {
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
      const { key, event } = JSON.parse(data);
      if (key === KEY) {
        this.handler(event);
      }
    } catch (error) {} // eslint-disable-line
  }
}

export default function createChannel({ page }): Channel {
  const transport = new PostmsgTransport({ page });
  return new Channel({ transport });
}
