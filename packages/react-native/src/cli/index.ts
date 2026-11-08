import path from 'node:path';
import { Command, InvalidArgumentError } from 'commander';
import type { DevicesState } from '../metro/deviceControl';
import { createChannelClient, resolveChannelEndpoint, type ChannelEndpoint } from './channelClient';
import { createDocsTools, type DocsResult } from './docs';
import { CliError } from './errors';
import { getSkill, getSkillCatalog, isSkillId, SKILL_IDS } from './skills';

const DEFAULT_DEVICE_TIMEOUT_MS = 10_000;

/**
 * Results go to the real stdout. Everything else written there, such as logs from the CSF parser
 * or docgen, is sent to stderr so stdout stays parseable.
 */
const writeResult = process.stdout.write.bind(process.stdout);

interface GlobalOptions {
  configDir: string;
  cwd?: string;
  url?: string;
  host?: string;
  port?: number;
  secured?: boolean;
  timeout: number;
  json?: boolean;
}

function parsePositiveInt(value: string) {
  const number = Number(value);

  if (!Number.isInteger(number) || number <= 0) {
    throw new InvalidArgumentError('Expected a positive integer.');
  }

  return number;
}

function parseJsonObject(value: string) {
  let json: unknown;

  try {
    json = JSON.parse(value);
  } catch {
    throw new InvalidArgumentError(`Expected a JSON object, e.g. '{"label":"Save"}'.`);
  }

  if (!json || typeof json !== 'object' || Array.isArray(json)) {
    throw new InvalidArgumentError(`Expected a JSON object, e.g. '{"label":"Save"}'.`);
  }

  return json as Record<string, unknown>;
}

function parseList(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function getGlobalOptions(command: Command): GlobalOptions {
  return command.optsWithGlobals<GlobalOptions>();
}

function getConfigPath(options: GlobalOptions) {
  return path.resolve(options.configDir);
}

function print(options: GlobalOptions, markdown: string, data: unknown) {
  writeResult(options.json ? `${JSON.stringify(data, null, 2)}\n` : `${markdown.trimEnd()}\n`);
}

function printDocsResult(options: GlobalOptions, result: DocsResult) {
  print(options, result.markdown, result.data ?? { markdown: result.markdown });

  if (!result.ok) {
    process.exitCode = 1;
  }
}

function getChannelClient(options: GlobalOptions) {
  const endpoint = resolveChannelEndpoint({
    cwd: process.cwd(),
    url: options.url,
    host: options.host,
    port: options.port,
    secured: options.secured,
  });

  return createChannelClient(endpoint, options.timeout);
}

function formatJson(value: unknown) {
  return `\`${JSON.stringify(value)}\``;
}

const ENDPOINT_SOURCES: Record<ChannelEndpoint['source'], string> = {
  flag: 'from the command line',
  env: 'from STORYBOOK_WS_* environment variables',
  record: 'found running in this project',
  default: 'default address',
};

function formatState(endpoint: ChannelEndpoint, state: DevicesState) {
  const lines = [
    `Channel server: ${endpoint.url} (${ENDPOINT_SOURCES[endpoint.source]})`,
    `Connected devices: ${state.devices.length}`,
  ];

  if (state.devices.length === 0) {
    lines.push(
      '',
      state.connectedClients > 0
        ? 'A client is connected but has not rendered a story yet. Open Storybook in the app, then run this again.'
        : 'No device is connected. Open Storybook in the app, then run this again.'
    );
  }

  for (const device of state.devices) {
    lines.push('', `## Device ${device.id}`, `- Connected: ${device.connectedAt}`);
    lines.push(`- Story: ${device.storyId ?? 'none rendered yet'}`);

    if (device.args) {
      lines.push(`- Args: ${formatJson(device.args)}`);
    }

    if (device.globals) {
      lines.push(`- Globals: ${formatJson(device.globals)}`);
    }

    if (device.lastError) {
      lines.push(
        `- Last render error${device.lastError.storyId ? ` (${device.lastError.storyId})` : ''}: ${device.lastError.message}`
      );
    }
  }

  return lines.join('\n');
}

export function createProgram() {
  const program = new Command('sb-rn')
    .description(
      'Look up component docs and drive Storybook on a React Native device, for people and coding agents.'
    )
    .option('-c, --config-dir <dir>', 'The Storybook config folder', './.rnstorybook')
    .option('--cwd <dir>', 'Run as if started in this directory (the app root)')
    .option('--url <url>', 'Channel server URL, e.g. http://localhost:7007')
    .option('--host <host>', 'Channel server host')
    .option('-p, --port <port>', 'Channel server port', parsePositiveInt)
    .option('--secured', 'Use https for the channel server')
    .option(
      '--timeout <ms>',
      'How long device commands wait for the device',
      parsePositiveInt,
      DEFAULT_DEVICE_TIMEOUT_MS
    )
    .option('--json', 'Print JSON instead of markdown')
    .configureOutput({ writeOut: (text) => writeResult(text) })
    .showHelpAfterError()
    .hook('preAction', (thisCommand) => {
      const { cwd } = thisCommand.opts<GlobalOptions>();

      if (cwd) {
        process.chdir(path.resolve(cwd));
      }
    });

  const docs = program
    .command('docs')
    .description('Component docs: props and usage examples. Reads story files, no device needed.');

  docs
    .command('list')
    .description('List every component and docs entry with its id')
    .option('--withStoryIds', 'Include the ids of each component’s stories')
    .action(async (options: { withStoryIds?: boolean }, command: Command) => {
      const globals = getGlobalOptions(command);
      const tools = await createDocsTools(getConfigPath(globals));
      printDocsResult(globals, await tools.list({ withStoryIds: Boolean(options.withStoryIds) }));
    });

  docs
    .command('show')
    .description('Show the props and example stories of one component')
    .requiredOption('--id <id>', 'Component id from `docs list`')
    .action(async (options: { id: string }, command: Command) => {
      const globals = getGlobalOptions(command);
      const tools = await createDocsTools(getConfigPath(globals));
      printDocsResult(globals, await tools.show({ id: options.id }));
    });

  docs
    .command('show-story')
    .description('Show the full code of one story')
    .option('--storyId <id>', 'Story id')
    .option('--componentId <id>', 'Component id, together with --storyName')
    .option('--storyName <name>', 'Story name, together with --componentId')
    .action(
      async (
        options: { storyId?: string; componentId?: string; storyName?: string },
        command: Command
      ) => {
        const globals = getGlobalOptions(command);
        const tools = await createDocsTools(getConfigPath(globals));
        printDocsResult(globals, await tools.showStory(options));
      }
    );

  const stories = program.command('stories').description('List and select stories');

  stories
    .command('list')
    .description('List every story id, grouped by title. Reads story files, no device needed.')
    .action(async (_options: unknown, command: Command) => {
      const globals = getGlobalOptions(command);
      const { buildIndex } = await import('../metro/buildIndex');
      const index = await buildIndex({ configPath: getConfigPath(globals) });
      const entries = Object.values(index.entries).map(({ id, title, name, importPath }) => ({
        id,
        title,
        name,
        importPath,
      }));

      const lines = ['# Stories'];
      let title: string | undefined;

      for (const entry of entries) {
        if (entry.title !== title) {
          title = entry.title;
          lines.push('', `## ${title}`);
        }

        lines.push(`- ${entry.name}: \`${entry.id}\``);
      }

      print(globals, lines.join('\n'), entries);
    });

  stories
    .command('select')
    .description('Show a story on the connected device and wait until it has rendered')
    .requiredOption('--storyId <id>', 'Story id from `stories list`')
    .action(async (options: { storyId: string }, command: Command) => {
      const globals = getGlobalOptions(command);
      const result = await getChannelClient(globals).selectStory(options.storyId);
      print(globals, `Story \`${result.storyId}\` is rendered on the device.`, result);
    });

  const args = program
    .command('args')
    .description('Change the args (props) of a story on the device');

  args
    .command('update')
    .description('Update args and print the resulting args')
    .requiredOption('--args <json>', 'Args to change, as a JSON object', parseJsonObject)
    .option('--storyId <id>', 'Story id. Defaults to the story on the device')
    .action(
      async (options: { args: Record<string, unknown>; storyId?: string }, command: Command) => {
        const globals = getGlobalOptions(command);
        const result = await getChannelClient(globals).updateArgs(options);
        print(globals, `Args of \`${result.storyId}\`: ${formatJson(result.args)}`, result);
      }
    );

  args
    .command('reset')
    .description('Reset args to the values the story defines')
    .option('--storyId <id>', 'Story id. Defaults to the story on the device')
    .option('--argNames <names>', 'Comma-separated args to reset. Defaults to all', parseList)
    .action(async (options: { storyId?: string; argNames?: string[] }, command: Command) => {
      const globals = getGlobalOptions(command);
      const result = await getChannelClient(globals).resetArgs(options);
      print(globals, `Args of \`${result.storyId}\`: ${formatJson(result.args)}`, result);
    });

  const globalsCommand = program
    .command('globals')
    .description('Change Storybook globals on the device');

  globalsCommand
    .command('update')
    .description('Update globals, such as a theme, and print the resulting globals')
    .requiredOption('--globals <json>', 'Globals to change, as a JSON object', parseJsonObject)
    .action(async (options: { globals: Record<string, unknown> }, command: Command) => {
      const globals = getGlobalOptions(command);
      const result = await getChannelClient(globals).updateGlobals(options);
      print(globals, `Globals: ${formatJson(result.globals)}`, result);
    });

  program
    .command('status')
    .description(
      'Show the channel server and the connected devices with their story, args and globals'
    )
    .action(async (_options: unknown, command: Command) => {
      const globals = getGlobalOptions(command);
      const client = getChannelClient(globals);
      const state = await client.getState();
      print(globals, formatState(client.endpoint, state), {
        url: client.endpoint.url,
        ...state,
      });
    });

  program
    .command('skills')
    .description(`Print agent instructions. One of: ${SKILL_IDS.join(', ')}`)
    .argument('[id]', 'Skill id. Lists the skills when omitted')
    .action((id: string | undefined) => {
      if (!id) {
        writeResult(getSkillCatalog());
        return;
      }

      if (!isSkillId(id)) {
        throw new CliError(`Unknown skill "${id}". Available skills: ${SKILL_IDS.join(', ')}`);
      }

      writeResult(getSkill(id));
    });

  return program;
}

export async function run(argv: string[] = process.argv) {
  process.stdout.write = process.stderr.write.bind(process.stderr) as typeof process.stdout.write;

  try {
    await createProgram().parseAsync(argv);
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  }
}
