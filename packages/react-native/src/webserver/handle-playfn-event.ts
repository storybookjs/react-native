import { isTapEventMessage, NativeEventMessage, ServerEventMessage } from './types';
import { execSync } from 'node:child_process';

const tap = ({ duration, udid, x, y }: { x: number; y: number; udid: string; duration: number }) =>
  `idb ui tap --udid ${udid} --duration ${duration} ${x} ${y}`;

const describe = (udid: string) => `idb ui describe-all --udid ${udid} --json --nested`;

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
};
