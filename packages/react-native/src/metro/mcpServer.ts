import type { IncomingMessage, ServerResponse } from 'node:http';
import type { TLSSocket } from 'node:tls';
import { buffer } from 'node:stream/consumers';
import type { StorybookContext } from '@storybook/mcp';
import type { DeviceControl } from './deviceControl';
import { createManifestProvider } from './manifestProvider';

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

  return new Request(url as unknown as string, {
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

function textResult(text: string, isError = false) {
  return {
    content: [{ type: 'text' as const, text }],
    ...(isError ? { isError: true } : {}),
  };
}

function errorResult(error: unknown) {
  return textResult(error instanceof Error ? error.message : String(error), true);
}

/**
 * Creates an MCP (Model Context Protocol) request handler for AI agent integration.
 *
 * Provides tools for querying component documentation, props, and story snippets,
 * React Native-specific story writing instructions, and, when websockets are enabled,
 * tools that drive the connected devices.
 *
 * @param configPath - Path to the Storybook config folder, used for building the component manifest.
 * @param deviceControl - Device control of the channel server, when websockets are enabled.
 */
export function createMcpHandler(configPath: string, deviceControl?: DeviceControl) {
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
          { addListAllDocumentationTool, addGetDocumentationTool, addGetStoryDocumentationTool },
          { storyInstructions },
          v,
        ] = await Promise.all([
          import('tmcp'),
          import('@tmcp/adapter-valibot'),
          import('@tmcp/transport-http'),
          import('@storybook/mcp'),
          import('./manifest/storyInstructions.js'),
          import('valibot'),
        ]);

        const manifestProvider = createManifestProvider(configPath);

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
        addGetStoryDocumentationTool(server);

        server.tool(
          {
            name: 'get-storybook-story-instructions',
            title: 'React Native Storybook Story Instructions',
            description:
              'Get instructions for writing React Native Storybook stories. ' +
              'Call this before creating or modifying story files (.stories.tsx, .stories.ts).',
          },
          async () => textResult(storyInstructions)
        );

        if (deviceControl) {
          const storyIdField = v.optional(
            v.pipe(
              v.string(),
              v.description(
                'The story ID, e.g. "button--primary". Defaults to the story currently rendered on the device.'
              )
            )
          );

          server.tool(
            {
              name: 'select-story',
              title: 'Select Story',
              description:
                'Select and display a story on the connected device, and wait until it has rendered. ' +
                'Use the story ID in the format "title--name" (e.g. "button--primary"). ' +
                'Story IDs come from docs-list with `withStoryIds: true` or from docs-show; never guess them.',
              schema: v.object({ storyId: v.string() }),
            },
            async ({ storyId }) => {
              try {
                await deviceControl.selectStory(storyId);
                return textResult(`Story "${storyId}" is rendered on the connected device.`);
              } catch (error) {
                return errorResult(error);
              }
            }
          );

          server.tool(
            {
              name: 'get-device-state',
              title: 'Get Device State',
              description:
                'Get the devices connected to Storybook with the story each one renders, its current args and globals, and the last render error.',
            },
            async () => textResult(JSON.stringify(deviceControl.getState(), null, 2))
          );

          server.tool(
            {
              name: 'update-story-args',
              title: 'Update Story Args',
              description:
                'Update the args (props) of a story on the connected device and return the resulting args. ' +
                'Use docs-show to find the props a component accepts.',
              schema: v.object({
                storyId: storyIdField,
                args: v.pipe(
                  v.record(v.string(), v.unknown()),
                  v.description('The args to change, e.g. { "label": "Save", "disabled": true }')
                ),
              }),
            },
            async ({ storyId, args }) => {
              try {
                const result = await deviceControl.updateArgs({ storyId, args });
                return textResult(JSON.stringify(result, null, 2));
              } catch (error) {
                return errorResult(error);
              }
            }
          );

          server.tool(
            {
              name: 'reset-story-args',
              title: 'Reset Story Args',
              description:
                'Reset the args of a story on the connected device to the values its story file defines.',
              schema: v.object({
                storyId: storyIdField,
                argNames: v.optional(
                  v.pipe(
                    v.array(v.string()),
                    v.description('Only reset these args. Resets every arg when omitted.')
                  )
                ),
              }),
            },
            async ({ storyId, argNames }) => {
              try {
                const result = await deviceControl.resetArgs({ storyId, argNames });
                return textResult(JSON.stringify(result, null, 2));
              } catch (error) {
                return errorResult(error);
              }
            }
          );

          server.tool(
            {
              name: 'update-globals',
              title: 'Update Globals',
              description:
                'Update Storybook globals on the connected device, such as a theme or locale toolbar value, and return the resulting globals.',
              schema: v.object({
                globals: v.record(v.string(), v.unknown()),
              }),
            },
            async ({ globals }) => {
              try {
                const result = await deviceControl.updateGlobals({ globals });
                return textResult(JSON.stringify(result, null, 2));
              } catch (error) {
                return errorResult(error);
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
