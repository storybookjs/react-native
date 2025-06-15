import { WebSocketServer, WebSocket, Data } from 'ws';
import { isNativeEventMessage, WebSocketMessage } from './types';
import { handlePlayfnEvent } from './handle-playfn-event';

export const setupWebsocketServer = ({
  port,
  host,
  deviceId,
}: {
  port: number;
  host: string;
  deviceId?: string;
}) => {
  const wss = new WebSocketServer({ port, host });

  wss.on('connection', function connection(ws: WebSocket) {
    console.log('WebSocket connection established');

    ws.on('error', console.error);

    ws.on('message', function message(data: Data) {
      try {
        const json = JSON.parse(data.toString()) as WebSocketMessage;

        const sendEvent = (eventData) => {
          wss.clients.forEach((wsClient) => wsClient.send(JSON.stringify(eventData)));
        };

        if (isNativeEventMessage(json)) {
          handlePlayfnEvent({ json, sendEvent, deviceId });
        } else {
          sendEvent(json);
        }
      } catch (error) {
        console.error(error);
      }
    });
  });
};

export * from './types';
export * from './handle-playfn-event';
