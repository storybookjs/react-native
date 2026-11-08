---
sidebar_position: 8
---

# Agent CLI (`sb-rn`)

`sb-rn` lets you, or a coding agent, look up component docs and drive Storybook on a connected device from the terminal. It ships with `@storybook/react-native`.

It offers the same tools as the [MCP server](./mcp-configuration.md), as shell commands. Coding agents that can run commands don't need an MCP client or MCP config to use it.

Run it from your app's directory, where the `.rnstorybook` folder is. Pass `--config-dir` if your config folder has another name.

## Component docs

These commands read your story files and run docgen in Node. They don't need the app or the bundler running.

```sh
npx sb-rn docs list                        # every component, with its id
npx sb-rn docs list --withStoryIds         # ...and the ids of its stories
npx sb-rn docs show --id <id>              # props and example stories of one component
npx sb-rn docs show-story --storyId <id>   # the full code of one story
npx sb-rn stories list                     # every story id, grouped by title
```

## Drive the device

These commands talk to the channel server, so the app must be running with Storybook open and the channel server enabled. Set `websockets` (or `experimental_mcp`) in your [Metro](./metro-configuration.md) or Re.Pack config:

```js
module.exports = withStorybook(config, {
  websockets: 'auto',
});
```

```sh
npx sb-rn status                                       # connected devices, current story, args and globals
npx sb-rn stories select --storyId <id>                # show a story and wait until it has rendered
npx sb-rn args update --args '{"label":"Save"}'        # change args of the current story
npx sb-rn args update --storyId <id> --args '{...}'    # ...or of another story
npx sb-rn args reset [--argNames label,disabled]       # back to the args the story defines
npx sb-rn globals update --globals '{"theme":"dark"}'
```

Each command waits for the device to confirm the change and prints the result, so an agent knows it worked. `stories select` fails with the device's error when the story throws while rendering, and suggests similar ids when the story doesn't exist.

`sb-rn` doesn't capture the screen. Use a tool such as [agent-device](https://agent-device.dev/), `xcrun simctl io booted screenshot` or `adb exec-out screencap -p` for that.

### Finding the channel server

`sb-rn` uses the first of these that is set:

1. `--url`, or `--host` and `--port`
2. The `STORYBOOK_WS_HOST` and `STORYBOOK_WS_PORT` environment variables, which the bundler also reads
3. The channel server running in this project. It writes its address to `node_modules/.cache/storybook-react-native/channel-server.json` while it runs.
4. `http://localhost:7007`

## Options

| Option                   | Description                                                   |
| ------------------------ | ------------------------------------------------------------- |
| `-c, --config-dir <dir>` | The Storybook config folder. Defaults to `./.rnstorybook`     |
| `--cwd <dir>`            | Run as if started in this directory                           |
| `--url <url>`            | Channel server URL, e.g. `http://localhost:7007`              |
| `--host <host>`          | Channel server host                                           |
| `-p, --port <port>`      | Channel server port                                           |
| `--secured`              | Use https for the channel server                              |
| `--timeout <ms>`         | How long device commands wait for the device. Defaults to 10s |
| `--json`                 | Print JSON instead of markdown                                |

Results go to stdout, and logs and errors go to stderr. The exit code is `1` when a command fails.

## Agent skills

`sb-rn skills` prints instructions written for coding agents:

```sh
npx sb-rn skills ui-workflow      # look up components, write stories, check them on the device
npx sb-rn skills component-docs   # look up components and their props
npx sb-rn skills write-story      # how to write React Native stories
```

The skills in the [repository's `skills` folder](https://github.com/storybookjs/react-native/tree/next/skills) tell agents to run these commands. The printed instructions match the installed version of `@storybook/react-native`.

## HTTP endpoints

The device commands use these channel server endpoints, which you can also call directly, for example from Maestro flows:

| Endpoint                                     | Body                                |
| -------------------------------------------- | ----------------------------------- |
| `GET /state`                                 |                                     |
| `POST /select-story-sync/{storyId}?timeout=` |                                     |
| `POST /update-args-sync`                     | `{ storyId?, args, timeout? }`      |
| `POST /reset-args-sync`                      | `{ storyId?, argNames?, timeout? }` |
| `POST /update-globals-sync`                  | `{ globals, timeout? }`             |

When `storyId` is omitted, the story rendered on the device is used. Errors return `{ success: false, code, error }` with one of these codes: `invalid-input` (400), `story-not-found` (404), `timeout` (408), `render-error` (422) or `no-device` (503).
