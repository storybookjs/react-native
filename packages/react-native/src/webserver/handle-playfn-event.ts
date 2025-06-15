import { isTapEventMessage, NativeEventMessage } from './types';
import { execSync } from 'node:child_process';

const tap = ({ duration, udid, x, y }: { x: number; y: number; udid: string; duration: number }) =>
  `idb ui tap --udid ${udid} --duration ${duration} ${x} ${y}`;

const describe = (udid: string) => `idb ui describe-all --udid ${udid} --json --nested`;
//0868A689-5B78-4F52-A63A-60CAA848BB88
export const handlePlayfnEvent = (json: NativeEventMessage, deviceId: string) => {
  const event = json.args[0];
  console.log('json', json);
  console.log('event', event);
  if (isTapEventMessage(event)) {
    console.log('tap event', event);
    const { x, y, duration = 1 } = event;
    const command = tap({ x, y, udid: deviceId, duration });
    console.log(command);
    execSync(command);
  }
};
