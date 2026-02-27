import type { IncomingMessage, ServerResponse } from 'node:http';
import type { TLSSocket } from 'node:tls';
import { buffer } from 'node:stream/consumers';
import type { StorybookContext } from '@storybook/mcp';
import type { WebSocketServer, WebSocket } from 'ws';

/**
 * Converts Node.js IncomingHttpHeaders to a format compatible with the Web Headers API.
 * Handles multi-value headers by joining them with commas per HTTP spec.
 */
function toHeaderEntries(nodeHeaders: IncomingMessage['headers']): Array<[string, string]> {
  const entries: Array<[string, string]> = [];

  for (const [key, value] of Object.entries(nodeHeaders)) {
    if (value === undefined) continue;
    entries.push([key, Array.isArray(value) ? value.join(', ') : value]);
  }

  return entries;
}

/**
 * Converts a Node.js IncomingMessage to a Web Request object.
 */
async function incomingMessageToWebRequest(req: IncomingMessage): Promise<Request> {
  const host = req.headers.host || 'localhost';
  const isTLS = 'encrypted' in req.socket && (req.socket as TLSSocket).encrypted;
  const protocol = isTLS ? 'https' : 'http';
  const url = new URL(req.url || '/', `${protocol}://${host}`);

  const bodyBuffer = await buffer(req);

  return new Request(url, {
    method: req.method,
    headers: toHeaderEntries(req.headers),
    body: bodyBuffer.length > 0 ? new Uint8Array(bodyBuffer) : undefined,
  });
}

/**
 * Converts a Web Response to a Node.js ServerResponse.
 */
async function webResponseToServerResponse(
  webResponse: Response,
  nodeResponse: ServerResponse
): Promise<void> {
  nodeResponse.statusCode = webResponse.status;

  webResponse.headers.forEach((value, key) => {
    nodeResponse.setHeader(key, value);
  });

  if (webResponse.body) {
    const reader = webResponse.body.getReader();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        nodeResponse.write(value);
      }
    } finally {
      reader.releaseLock();
    }
  }

  nodeResponse.end();
}

/**
 * Creates an MCP (Model Context Protocol) request handler for AI agent integration.
 *
 * Provides tools for querying component documentation, props, and story snippets,
 * plus React Native-specific story writing instructions.
 *
 * @param configPath - Path to the Storybook config folder, used for building the component manifest.
 */
export function createMcpHandler(configPath: string, wss?: WebSocketServer) {
  let handler: ((req: Request) => Promise<Response>) | null = null;
  let initPromise: Promise<void> | null = null;

  async function init() {
    if (handler) return;
    if (initPromise) {
      await initPromise;
      return;
    }

    initPromise = (async () => {
      try {
        const [
          { McpServer },
          { ValibotJsonSchemaAdapter },
          { HttpTransport },
          {
            addListAllDocumentationTool,
            addGetDocumentationTool,
            addGetComponentStoryDocumentationTool,
          },
          { storyInstructions },
          { buildIndex },
          valibot,
          { experimental_manifests },
        ] = await Promise.all([
          import('tmcp'),
          import('@tmcp/adapter-valibot'),
          import('@tmcp/transport-http'),
          import('@storybook/mcp'),
          import('./manifest/storyInstructions.js'),
          import('./buildIndex.js'),
          import('valibot'),
          import('@storybook/react/preset'),
        ]);

        const manifestProvider: NonNullable<StorybookContext['manifestProvider']> = async (
          _request,
          manifestPath
        ) => {
          if (manifestPath.includes('docs.json')) {
            throw new Error('Docs manifest not available in React Native Storybook');
          }

          const index = await buildIndex({ configPath });
          const entries = Object.values(index.entries);
          const manifest = await experimental_manifests({}, { manifestEntries: entries });

          return JSON.stringify(manifest.components);
        };

        const server = new McpServer(
          {
            name: '@storybook/react-native',
            version: '1.0.0',
            description: 'Storybook React Native MCP server',
          },
          {
            adapter: new ValibotJsonSchemaAdapter(),
            capabilities: {
              tools: { listChanged: true },
            },
          }
        ).withContext<StorybookContext>();

        addListAllDocumentationTool(server);
        addGetDocumentationTool(server);
        addGetComponentStoryDocumentationTool(server);

        server.tool(
          {
            name: 'get-storybook-story-instructions',
            title: 'React Native Storybook Story Instructions',
            description:
              'Get instructions for writing React Native Storybook stories. ' +
              'Call this before creating or modifying story files (.stories.tsx, .stories.ts).',
          },
          async () => ({
            content: [{ type: 'text' as const, text: storyInstructions }],
          })
        );

        if (wss) {
          const broadcastEvent = (event: Record<string, unknown>) => {
            const message = JSON.stringify(event);

            wss.clients.forEach((client: WebSocket) => {
              if (client.readyState === 1 /* WebSocket.OPEN */) {
                client.send(message);
              }
            });
          };

          server.tool(
            {
              name: 'select-story',
              title: 'Select Story',
              description:
                'Select and display a story on the connected device. ' +
                'Use the story ID in the format "title--name" (e.g. "button--primary"). ' +
                'Use the list-all-documentation tool to discover available components and stories.',
              schema: valibot.object({ storyId: valibot.string() }),
            },
            async ({ storyId }: { storyId: string }) => {
              try {
                const index = await buildIndex({ configPath });

                if (!index.entries[storyId]) {
                  const availableIds = Object.keys(index.entries).slice(0, 10);

                  return {
                    content: [
                      {
                        type: 'text' as const,
                        text:
                          `Story "${storyId}" not found. ` +
                          `Available stories include: ${availableIds.join(', ')}` +
                          (Object.keys(index.entries).length > 10 ? ', ...' : ''),
                      },
                    ],
                    isError: true,
                  };
                }

                broadcastEvent({
                  type: 'setCurrentStory',
                  args: [{ storyId, viewMode: 'story' }],
                });

                const entry = index.entries[storyId];

                return {
                  content: [
                    {
                      type: 'text' as const,
                      text: `Selected story "${entry.name}" (${entry.title}) on connected devices.`,
                    },
                  ],
                };
              } catch (error) {
                return {
                  content: [
                    {
                      type: 'text' as const,
                      text: `Failed to select story: ${error instanceof Error ? error.message : String(error)}`,
                    },
                  ],
                  isError: true,
                };
              }
            }
          );
        }

        const transport = new HttpTransport(server, { path: null });

        handler = (req) =>
          transport.respond(req, {
            request: req,
            manifestProvider,
          });

        console.log('[Storybook] MCP server initialized');
      } catch (error) {
        initPromise = null;
        console.error('[Storybook] Failed to initialize MCP server:', error);
        throw error;
      }
    })();

    await initPromise;
  }

  /**
   * Handles an incoming MCP HTTP request (POST /mcp or GET /mcp).
   */
  async function handleMcpRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
    try {
      await init();
      if (!handler) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'MCP handler not initialized' }));
        return;
      }

      const webRequest = await incomingMessageToWebRequest(req);
      const webResponse = await handler(webRequest);
      await webResponseToServerResponse(webResponse, res);
    } catch (error) {
      console.error('[Storybook] MCP request failed:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'MCP request failed' }));
    }
  }

  /**
   * Pre-initializes the MCP server (non-blocking).
   */
  function preInit() {
    init().catch((e) =>
      console.warn('[Storybook] MCP pre-initialization failed (will retry on first request):', e)
    );
  }

  return { handleMcpRequest, preInit };
}
