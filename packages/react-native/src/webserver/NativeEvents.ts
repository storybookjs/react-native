import { Channel } from 'storybook/internal/channels';
import { addons } from 'storybook/internal/preview-api';
import { ElementData, ServerEventData } from './types';

export class NativeElement {
  channel: Channel;
  sessionId: string;

  elementData: ElementData;
  center?: { x: number; y: number };

  constructor(channel: Channel, sessionId: string, elementData: ElementData) {
    this.channel = channel;
    this.sessionId = sessionId;
    this.elementData = elementData;
    if (elementData.frame) {
      this.center = {
        x: Math.round(elementData.frame?.x + elementData.frame?.width / 2),
        y: Math.round(elementData.frame?.y + elementData.frame?.height / 2),
      };
    }
  }

  tap = async (duration?: number) => {
    if (!this.center) {
      throw new Error('Element has no center');
    }

    return tap({
      x: this.center.x,
      y: this.center.y,
      channel: this.channel,
      sessionId: this.sessionId,
      duration: duration,
    });
  };

  type = async (text: string) => {
    return typeText({
      text: text,
      channel: this.channel,
      sessionId: this.sessionId,
    });
  };
}

const tap = ({
  x,
  y,
  channel,
  sessionId,
  duration,
}: {
  x: number;
  y: number;
  channel: Channel;
  sessionId: string;
  duration?: number;
}) =>
  new Promise(async (resolve) => {
    channel.emit('nativeEvent', {
      type: 'tap',
      x: x,
      y: y,
      duration: duration || 0.2,
      sessionId: sessionId,
    });

    channel.once('serverEvent', async (event: ServerEventData) => {
      console.log('serverEvent', event);

      if (event?.type === 'tapCompleted') {
        if (event?.success) {
          resolve(true);
        }
      }
    });
  });

const typeText = ({
  text,
  channel,
  sessionId,
}: {
  text: string;
  channel: Channel;
  sessionId: string;
}) =>
  new Promise(async (resolve) => {
    channel.emit('nativeEvent', {
      type: 'typeText',
      text: text,
      sessionId: sessionId,
    });

    channel.once('serverEvent', async (event: ServerEventData) => {
      console.log('serverEvent', event);

      if (event?.type === 'typeTextCompleted') {
        if (event?.success) {
          resolve(true);
        }
      }
    });
  });

export class NativeScreen {
  channel: Channel;
  sessionId: string;

  constructor() {
    this.sessionId = Date.now().toString(36) + Math.random().toString(36).substring(2);
    this.channel = addons.getChannel();
  }

  tap = async (x: number, y: number, duration?: number) => {
    return tap({
      x: x,
      y: y,
      channel: this.channel,
      sessionId: this.sessionId,
      duration: duration,
    });
  };

  type = async (text: string) => {
    return typeText({
      text: text,
      channel: this.channel,
      sessionId: this.sessionId,
    });
  };

  getByText = async (text: string): Promise<NativeElement> => {
    return new Promise(async (resolve, reject) => {
      this.channel.emit('nativeEvent', {
        type: 'getByText',
        text: text,
        sessionId: this.sessionId,
      });

      this.channel.once('serverEvent', async (event: ServerEventData) => {
        console.log('serverEvent', event);

        if (event?.type === 'getByTextCompleted') {
          if (event?.success) {
            console.log('getByText completed');

            resolve(new NativeElement(this.channel, this.sessionId, event.element));
          } else {
            reject(new Error('Failed to get element by text'));
          }
        }
      });
    });
  };

  getByPlaceholder = async (placeholder: string): Promise<NativeElement> => {
    return new Promise(async (resolve, reject) => {
      this.channel.emit('nativeEvent', {
        type: 'getByPlaceholder',
        placeholder: placeholder,
        sessionId: this.sessionId,
      });

      this.channel.once('serverEvent', async (event: ServerEventData) => {
        console.log('serverEvent', event);

        if (event?.type === 'getByPlaceholderCompleted') {
          if (event?.success) {
            console.log('getByPlaceholder completed');

            resolve(new NativeElement(this.channel, this.sessionId, event.element));
          } else {
            reject(new Error('Failed to get element by placeholder'));
          }
        }
      });
    });
  };
}
