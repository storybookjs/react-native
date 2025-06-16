import {
  isGetByTextEventMessage,
  isTapEventMessage,
  NativeEventMessage,
  ServerEventMessage,
} from './types';
import { execSync } from 'node:child_process';

const tap = ({ duration, udid, x, y }: { x: number; y: number; udid: string; duration: number }) =>
  `idb ui tap --udid ${udid} --duration ${duration} ${x} ${y}`;

const describe = (udid: string) => `idb ui describe-all --udid ${udid} --json --nested`;

export type AXElement = {
  AXFrame: string;
  AXUniqueId: string | null;
  frame: {
    y: number;
    x: number;
    width: number;
    height: number;
  };
  role_description: string;
  AXLabel: string | null;
  content_required: boolean;
  type: string;
  title: string | null;
  help: string | null;
  custom_actions: any[]; // You can type this more strictly if you know the structure
  AXValue: any; // Use a more specific type if possible
  enabled: boolean;
  role: string;
  children: AXElement[];
  subrole: string | null;
};

export const handlePlayfnEvent = ({
  json,
  sendEvent,
  deviceId,
}: {
  sendEvent: (eventData: ServerEventMessage) => void;
  json: NativeEventMessage;
  deviceId?: string;
}) => {
  if (!deviceId) {
    console.warn('No device ID provided');
    return;
  }

  const event = json.args[0];

  if (isTapEventMessage(event)) {
    console.log('tap event', event);
    const { x, y, duration = 1 } = event;
    const command = tap({ x, y, udid: deviceId, duration });

    console.log(command);
    execSync(command);

    sendEvent({
      type: 'serverEvent',
      args: [{ type: 'tapCompleted', success: true, sessionId: json.args[0].sessionId }],
      from: 'playfn',
    });
  }
  if (isGetByTextEventMessage(event)) {
    console.log('getByText event', event);
    const { text } = event;
    const command = describe(deviceId);

    const result = execSync(command);

    const json = JSON.parse(result.toString());

    const elements = findElementsByAXLabel(json, text);
    console.log('elements', elements);

    sendEvent({
      type: 'serverEvent',
      args: [
        {
          type: 'getByTextCompleted',
          success: true,
          sessionId: event.sessionId,
          element: elements[0],
        },
      ],
      from: 'playfn',
    });
  }
};

export function findElementsByAXLabel(elements: AXElement[], text: string): AXElement[] {
  const matches: AXElement[] = [];

  for (const el of elements) {
    if (el.AXLabel === text) {
      matches.push(el);
    }
    if (el.children && el.children.length > 0) {
      matches.push(...findElementsByAXLabel(el.children, text));
    }
  }

  return matches;
}
