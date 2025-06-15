import { WebSocketServer, WebSocket, Data } from 'ws';
import { isNativeEventMessage, WebSocketMessage } from './types';
import { handlePlayfnEvent } from './handle-playfn-event';

export const setupWebsocketServer = ({ port, host }: { port: number; host: string }) => {
  const wss = new WebSocketServer({ port, host });

  wss.on('connection', function connection(ws: WebSocket) {
    console.log('WebSocket connection established');

    ws.on('error', console.error);

    ws.on('message', function message(data: Data) {
      try {
        const json = JSON.parse(data.toString()) as WebSocketMessage;

        console.log('event type', json.type);

        if (isNativeEventMessage(json)) {
          handlePlayfnEvent(json, '0868A689-5B78-4F52-A63A-60CAA848BB88');
        } else {
          wss.clients.forEach((wsClient) => wsClient.send(JSON.stringify(json)));
        }
      } catch (error) {
        console.error(error);
      }
    });
  });
};
