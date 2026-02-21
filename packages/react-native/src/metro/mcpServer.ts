import type { IncomingMessage, ServerResponse } from 'node:http';
import { buffer } from 'node:stream/consumers';

/**
 * Converts a Node.js IncomingMessage to a Web Request object.
 */
async function incomingMessageToWebRequest(req: IncomingMessage): Promise<Request> {
  const host = req.headers.host || 'localhost';
  const protocol = 'encrypted' in req.socket && (req.socket as any).encrypted ? 'https' : 'http';
  const url = new URL(req.url || '/', `${protocol}://${host}`);

  const bodyBuffer = await buffer(req);

  return new Request(url, {
    method: req.method,
    headers: req.headers as HeadersInit,
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
export function createMcpHandler(configPath: string) {
  let handler: ((req: Request) => Promise<Response>) | null = null;
  let initPromise: Promise<void> | null = null;
  let cachedManifest: string | null = null;
  let manifestBuildPromise: Promise<string> | null = null;

  async function getOrBuildManifest(): Promise<string> {
    if (cachedManifest) return cachedManifest;
    if (manifestBuildPromise) return manifestBuildPromise;

    manifestBuildPromise = (async () => {
      const { buildManifest } = await import('./manifest/buildManifest.js');
      const manifest = await buildManifest({ configPath });
      cachedManifest = JSON.stringify(manifest);
      return cachedManifest;
    })();

    return manifestBuildPromise;
  }

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
        ] = await Promise.all([
          import('tmcp'),
          import('@tmcp/adapter-valibot'),
          import('@tmcp/transport-http'),
          import('@storybook/mcp'),
          import('./manifest/storyInstructions.js'),
        ]);

        const manifestProvider = async (_request: Request | undefined, manifestPath: string) => {
          if (manifestPath.includes('docs.json')) {
            throw new Error('Docs manifest not available in React Native Storybook');
          }
          return getOrBuildManifest();
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
        ).withContext<{ request?: Request; manifestProvider: typeof manifestProvider }>();

        await addListAllDocumentationTool(server as any);
        await addGetDocumentationTool(server as any);
        await addGetComponentStoryDocumentationTool(server as any);

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

        const transport = new HttpTransport(server, { path: null });

        handler = async (req: Request) => {
          return await transport.respond(req, {
            request: req,
            manifestProvider,
          });
        };

        console.log('[Storybook] MCP server initialized');
      } catch (error) {
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
   * Handles a GET /manifests/components.json request.
   */
  async function handleManifestRequest(_req: IncomingMessage, res: ServerResponse): Promise<void> {
    try {
      const manifestJson = await getOrBuildManifest();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(manifestJson);
    } catch (error) {
      console.error('[Storybook] Failed to build manifest:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to build component manifest' }));
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

  return { handleMcpRequest, handleManifestRequest, preInit };
}
