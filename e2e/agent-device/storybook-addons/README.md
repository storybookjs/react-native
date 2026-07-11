# Storybook Addon Device Replays

These `agent-device` Maestro-compatible replays cover the repeatable checks used for the example apps:

- story navigation through Storybook websocket story selection
- Actions logging
- Controls visibility and mutation where the example supports it
- Backgrounds visibility for full UI apps
- expected absence of Backgrounds in lite UI examples that only register Controls and Actions

## Prerequisites

Start the matching dev server before replaying a flow.

```sh
# expo-example
EXPO_PUBLIC_STORYBOOK_ENABLED=true pnpm --dir examples/expo-example exec expo start --dev-client --clear --port 8081

# expo-new-wrapper-example
STORYBOOK_ENABLED=true pnpm --dir examples/expo-new-wrapper-example exec expo start --dev-client --clear --port 8081

# expo-router-example
STORYBOOK_ENABLED=true pnpm --dir examples/expo-router-example exec expo start --dev-client --clear --port 8081

# repack-example
STORYBOOK_ENABLED=true pnpm --dir examples/repack-example exec react-native webpack-start --reset-cache
```

For Android Expo dev-client URLs, replace `192.168.1.225` with the current LAN host printed by Expo if it changes.

## Run Individual Flows

```sh
# expo-example
agent-device replay e2e/agent-device/storybook-addons/expo-example-full-ui.yaml --maestro --platform ios -e OPEN_LINK='storybook://expo-development-client/?url=http%3A%2F%2Flocalhost%3A8081' --timeout 120000
agent-device replay e2e/agent-device/storybook-addons/expo-example-full-ui.yaml --maestro --platform android -e OPEN_LINK='storybook://expo-development-client/?url=http%3A%2F%2F192.168.1.225%3A8081' --timeout 120000

# expo-new-wrapper-example
agent-device replay e2e/agent-device/storybook-addons/expo-new-wrapper-lite-ui.yaml --maestro --platform ios -e OPEN_LINK='storybook-newwrapper://expo-development-client/?url=http%3A%2F%2Flocalhost%3A8081' --timeout 120000
agent-device replay e2e/agent-device/storybook-addons/expo-new-wrapper-lite-ui.yaml --maestro --platform android -e OPEN_LINK='storybook-newwrapper://expo-development-client/?url=http%3A%2F%2F192.168.1.225%3A8081' --timeout 120000

# expo-router-example
agent-device replay e2e/agent-device/storybook-addons/expo-router-lite-ui.yaml --maestro --platform ios -e OPEN_LINK='exporouterexample://expo-development-client/?url=http%3A%2F%2Flocalhost%3A8081' --timeout 120000
agent-device replay e2e/agent-device/storybook-addons/expo-router-lite-ui.yaml --maestro --platform android -e OPEN_LINK='exporouterexample://expo-development-client/?url=http%3A%2F%2F192.168.1.225%3A8081' --timeout 120000

# repack-example
agent-device replay e2e/agent-device/storybook-addons/repack-full-ui.yaml --maestro --platform ios -e APP_ID='com.microsoft.ReactTestApp' --timeout 120000
agent-device replay e2e/agent-device/storybook-addons/repack-full-ui.yaml --maestro --platform android -e APP_ID='com.microsoft.reacttestapp' --timeout 120000
```

## Run As A Suite

Run one app/server at a time, because every example uses port `8081` and the Storybook websocket on `7007`.

```sh
agent-device test e2e/agent-device/storybook-addons/expo-example-full-ui.yaml --maestro --platform ios -e OPEN_LINK='storybook://expo-development-client/?url=http%3A%2F%2Flocalhost%3A8081' --artifacts-dir artifacts/agent-device/storybook-addons --report-junit artifacts/agent-device/storybook-addons/junit.xml --timeout 120000
```
