import * as v from 'valibot';
import { createManifestProvider } from '../metro/manifestProvider';
import { CliError } from './errors';

interface ToolResult {
  content: Array<{ type: string; text?: string }>;
  structuredContent?: unknown;
  isError?: boolean;
}

type ToolHandler = (input: unknown) => Promise<ToolResult>;

export interface DocsResult {
  ok: boolean;
  markdown: string;
  data?: unknown;
}

const MCP_TO_CLI_TOOL_NAMES: Record<string, string> = {
  'docs-show-story': 'npx sb-rn docs show-story',
  'docs-show': 'npx sb-rn docs show',
  'docs-list': 'npx sb-rn docs list',
};

function formatIssues(issues: v.BaseIssue<unknown>[]) {
  return issues
    .map((issue) => {
      const key = issue.path?.map((item) => String(item.key)).join('.');
      return key ? `--${key}: ${issue.message}` : issue.message;
    })
    .join('\n');
}

/** The docs tools describe each other by their MCP names; point agents at the CLI instead. */
export function rewriteToolNames(text: string): string {
  return text
    .replace(
      /(?:the )?`?\b(docs-show-story|docs-show|docs-list)\b`?(?![\w-])(?: tool)?/g,
      (_match, name: string) => `\`${MCP_TO_CLI_TOOL_NAMES[name]}\``
    )
    .replace(/`withStoryIds: true`/g, '`--withStoryIds`');
}

/**
 * Runs the `@storybook/mcp` docs tools in-process, so `sb-rn docs` answers exactly like the MCP
 * server's docs tools. The tools register themselves on a server; this collects their handlers
 * instead of serving them.
 */
export async function createDocsTools(configPath: string) {
  const mcp = await import('@storybook/mcp');
  const tools = new Map<string, { schema?: v.GenericSchema; handler: ToolHandler }>();
  const server = {
    ctx: { custom: { manifestProvider: createManifestProvider(configPath) } },
    tool(metadata: { name: string; schema?: v.GenericSchema }, handler: ToolHandler) {
      tools.set(metadata.name, { schema: metadata.schema, handler });
    },
  };

  type Server = Parameters<typeof mcp.addListAllDocumentationTool>[0];
  await mcp.addListAllDocumentationTool(server as unknown as Server);
  await mcp.addGetDocumentationTool(server as unknown as Server);
  await mcp.addGetStoryDocumentationTool(server as unknown as Server);

  const call = async (name: string, input: Record<string, unknown>): Promise<DocsResult> => {
    const tool = tools.get(name);

    if (!tool) {
      throw new CliError(`The ${name} tool is not available in this version of @storybook/mcp.`);
    }

    let parsedInput: unknown = input;

    if (tool.schema) {
      const parsed = v.safeParse(tool.schema, input);

      if (!parsed.success) {
        throw new CliError(`Invalid input:\n${formatIssues(parsed.issues)}`);
      }

      parsedInput = parsed.output;
    }

    const result = await tool.handler(parsedInput);
    const markdown = result.content
      .map((block) => block.text)
      .filter((text): text is string => typeof text === 'string')
      .join('\n\n');

    return {
      ok: !result.isError,
      markdown: rewriteToolNames(markdown),
      data: result.structuredContent,
    };
  };

  return {
    list: (input: { withStoryIds?: boolean }) => call(mcp.LIST_TOOL_NAME, input),
    show: (input: { id: string }) => call(mcp.GET_TOOL_NAME, input),
    showStory: (input: { storyId?: string; componentId?: string; storyName?: string }) =>
      call(mcp.GET_STORY_TOOL_NAME, input),
  };
}
