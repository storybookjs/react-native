import type { ServerResponse } from 'node:http';
import { WebSocket, type WebSocketServer } from 'ws';

export const SELECT_STORY_SYNC_ROUTE = '/select-story-sync/';
const SELECT_STORY_SYNC_TIMEOUT_MS = 1000;

interface PendingStorySelection {
  resolve: () => void;
  timeout: ReturnType<typeof setTimeout>;
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

  const waitForStoryRender = (storyId: string, timeoutMs: number): Promise<void> =>
    new Promise((resolve, reject) => {
      let selections = pendingStorySelections.get(storyId);
      if (!selections) {
        selections = new Set<PendingStorySelection>();
        pendingStorySelections.set(storyId, selections);
      }

      const selection: PendingStorySelection = {
        resolve: () => {
          clearTimeout(selection.timeout);
          selections.delete(selection);
          if (selections.size === 0) {
            pendingStorySelections.delete(storyId);
          }
          resolve();
        },
        timeout: setTimeout(() => {
          selections.delete(selection);
          if (selections.size === 0) {
            pendingStorySelections.delete(storyId);
          }
          reject(new Error(`Story "${storyId}" did not render in time`));
        }, timeoutMs),
      };

      selections.add(selection);
    });

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
      await waitForRender;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, storyId }));
    } catch {
      // If no render event arrives we still return success, because the requested
      // story may already be selected and therefore not emit storyRendered again.
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          success: true,
          storyId,
          rendered: false,
        })
      );
    }
  };

  const onSocketMessage = (event: unknown) => {
    const renderedStoryId = getRenderedStoryId(event);
    if (renderedStoryId) {
      resolveStorySelection(renderedStoryId);
    }
  };

  return {
    handleRequest,
    onSocketMessage,
  };
}
