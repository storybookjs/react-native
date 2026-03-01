This file provides guidance to agents when working with code in this repository.

check available mcp and skills

use pnpm for commands, check package.json for scripts

## On-Device Testing Tools

- use agent-device to control a simulator
  - check `agent-device --help`
- use rn-logs to get metro logs
  - check `rn-logs logs --help`
- use the storybook mcp to select stories and get story list

### agent-device (iOS/Android Simulator Control)

Use `agent-device` to interact with iOS/Android simulators for testing the Storybook app:

```bash
agent-device open host.exp.Exponent --relaunch  # Relaunch Expo Go
agent-device snapshot -c                         # Take accessibility snapshot (shows @refs)
agent-device click @e14                          # Click element by ref from snapshot
agent-device find "Press me" click               # Find text and click it
```

After relaunching, you need to press the "Expo Example" to go to it.

### rn-logs (React Native Log Streaming)

```bash
rn-logs apps                              # List running apps
rn-logs logs --app "host.exp.Exponent"    # Stream logs from Expo Go
```

## Architecture Overview

**pnpm workspaces monorepo** managed by Lerna containing React Native Storybook packages.

### Key Concepts

1. **CSF (Component Story Format)** - Standard story syntax
2. **On-device UI** - Native UI that runs directly on mobile devices
3. **Story requires generation** - Automatic generation of story imports via Metro (`storybook.requires.ts`)
4. **Portable stories** - Reuse stories in unit tests via `universal-test-renderer`
5. web storybook codebase can be referenced and likely can be found at ../storybook (from root)

additional information in docs folder and readme file
