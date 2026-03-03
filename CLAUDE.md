This file provides guidance to agents when working with code in this repository.

check available mcp and skills

use pnpm for commands, check package.json for scripts

## On-Device Testing Tools

- use agent-device to control a simulator `agent-device --help`
- use rn-logs to get metro logs `rn-logs logs --help`
- use the storybook mcp to select stories and get story list

use curl to send events to channel server, such as to update the args:

```sh
curl -X POST http://localhost:7007/send-event \
  -H "Content-Type: application/json" \
  -d '{
    "type": "updateStoryArgs",
    "args": [{
      "storyId": "controlexamples-controlexample--example",
      "updatedArgs": { "name": "Alice", "age": 25 }
    }]
  }'
```

### agent-device (iOS/Android Simulator Control)

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

## Key Concepts

1. **CSF (Component Story Format)** - Standard story syntax
2. **On-device UI** - Native UI that runs directly on mobile devices
3. **Story requires generation** - Automatic generation of story imports via Metro (`storybook.requires.ts`)
4. **Portable stories** - Reuse stories in unit tests via `universal-test-renderer`
5. web storybook codebase can be referenced and likely can be found at ../storybook (from root)

additional information in docs folder and readme file
