import type { ServerResponse } from 'node:http';
import { WebSocket, type WebSocketServer } from 'ws';

export const SELECT_STORY_SYNC_ROUTE = '/select-story-sync/';
const SELECT_STORY_SYNC_TIMEOUT_MS = 1000;
const LAST_RENDERED_STORY_TIMEOUT_MS = 500;

interface PendingStorySelection {
  resolve: () => void;
  timeout: ReturnType<typeof setTimeout>;
  settled: boolean;
}

interface StoryRenderWait {
  promise: Promise<void>;
  cancel: () => void;
}

function getRenderedStoryId(event: unknown): string | null {
  if (!event || typeof event !== 'object') {
    return null;
  }

  const { type, args } = event as { type?: unknown; args?: unknown };

  if (type !== 'storyRendered' || !Array.isArray(args) || args.length === 0) {
    return null;
  }

  const [firstArg] = args;

  if (typeof firstArg === 'string') {
    return firstArg;
  }

  if (firstArg && typeof firstArg === 'object' && 'storyId' in firstArg) {
    const { storyId } = firstArg as { storyId?: unknown };
    return typeof storyId === 'string' ? storyId : null;
  }

  return null;
}

function parseStoryIdFromPath(pathname: string): string | null {
  const match = pathname.match(/^\/select-story-sync\/([^/]+)$/);

  if (!match) {
    return null;
  }

  try {
    const storyId = decodeURIComponent(match[1]);
    return storyId || null;
  } catch {
    return null;
  }
}

export function createSelectStorySyncEndpoint(wss: WebSocketServer) {
  const pendingStorySelections = new Map<string, Set<PendingStorySelection>>();
  const lastRenderedStoryIdByClient = new Map<WebSocket, string>();

  const waitForStoryRender = (storyId: string, timeoutMs: number): StoryRenderWait => {
    let cancelSelection = () => {};
    let resolveWait = () => {};

    const promise = new Promise<void>((resolve, reject) => {
      resolveWait = resolve;

      let selections = pendingStorySelections.get(storyId);
      if (!selections) {
        selections = new Set<PendingStorySelection>();
        pendingStorySelections.set(storyId, selections);
      }

      const cleanup = () => {
        clearTimeout(selection.timeout);
        selections.delete(selection);
        if (selections.size === 0) {
          pendingStorySelections.delete(storyId);
        }
      };

      const selection: PendingStorySelection = {
        resolve: () => {
          if (selection.settled) {
            return;
          }
          selection.settled = true;
          cleanup();
          resolve();
        },
        timeout: setTimeout(() => {
          if (selection.settled) {
            return;
          }
          selection.settled = true;
          cleanup();
          reject(new Error(`Story "${storyId}" did not render in time`));
        }, timeoutMs),
        settled: false,
      };

      cancelSelection = () => {
        if (selection.settled) {
          return;
        }
        selection.settled = true;
        cleanup();
        resolveWait();
      };

      selections.add(selection);
    });
    return {
      promise,
      cancel: cancelSelection,
    };
  };

  const resolveStorySelection = (storyId: string) => {
    const selections = pendingStorySelections.get(storyId);
    if (!selections) {
      return;
    }

    [...selections].forEach((selection) => selection.resolve());
  };

  const handleRequest = async (pathname: string, res: ServerResponse): Promise<void> => {
    const storyId = parseStoryIdFromPath(pathname);

    if (!storyId) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'Invalid story id' }));
      return;
    }

    const waitForRender = waitForStoryRender(storyId, SELECT_STORY_SYNC_TIMEOUT_MS);
    const message = JSON.stringify({
      type: 'setCurrentStory',
      args: [{ viewMode: 'story', storyId }],
    });

    wss.clients.forEach((wsClient) => {
      if (wsClient.readyState === WebSocket.OPEN) {
        wsClient.send(message);
      }
    });

    try {
      const hasConnectedClientWithRenderedStory = [...wss.clients].some(
        (client) =>
          client.readyState === WebSocket.OPEN &&
          lastRenderedStoryIdByClient.get(client) === storyId
      );

      if (hasConnectedClientWithRenderedStory) {
        const raceResult = await Promise.race([
          waitForRender.promise.then(() => 'rendered' as const),
          new Promise<'alreadyRendered'>((resolve) => {
            setTimeout(() => resolve('alreadyRendered'), LAST_RENDERED_STORY_TIMEOUT_MS);
          }),
        ]);

        if (raceResult === 'alreadyRendered') {
          waitForRender.cancel();
        }
      } else {
        await waitForRender.promise;
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, storyId }));
    } catch (error) {
      res.writeHead(408, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          success: false,
          storyId,
          error: error instanceof Error ? error.message : String(error),
        })
      );
    }
  };

  const onSocketMessage = (event: unknown, ws: WebSocket) => {
    const renderedStoryId = getRenderedStoryId(event);
    if (renderedStoryId) {
      lastRenderedStoryIdByClient.set(ws, renderedStoryId);
      resolveStorySelection(renderedStoryId);
    }
  };

  const onSocketClose = (ws: WebSocket) => {
    lastRenderedStoryIdByClient.delete(ws);
  };

  return {
    handleRequest,
    onSocketMessage,
    onSocketClose,
  };
}
