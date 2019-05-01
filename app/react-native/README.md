# Storybook for React Native

With Storybook for React Native you can design and develop individual React Native components without running your app.

![Storybook Screenshot](docs/assets/readme/screenshot.png)

For more information visit: [storybook.js.org](https://storybook.js.org)

## Getting Started

The `storybook` CLI tool can be used to add Storybook to your React Native app. Install the `storybook` tool if necessary and run it from your project directory with these commands:

```shell
cd my-rn-app
npx -p @storybook/cli sb init
```

During installation it will ask if you want to install storybook server.
It allows you to control the storybook from your web browser.

The next thing you need to do is make Storybook UI visible in your app.

### CRNA, React Native vanilla

The easiest way to use Storybook is to simply replace your App with the Storybook UI, which is possible by replacing `App.js` with a single line of code:

```js
export default from './storybook';
```

This will get you up and running quickly, but then you lose your app!
There are multiple options here. for example, you can export conditionally:

```js
import StorybookUI from './storybook';

import App from './app';

module.exports = __DEV__ ? StorybookUI : App;
```

### React Native Navigation, other complex use cases

`StorybookUI` is simply a RN `View` component that can be embedded anywhere in your RN application, e.g. on a tab or within an admin screen.

## Start Storybook server (optional)

If you want to control storybook from browser/VS Code/websockets you need install and start the server.

```sh
npm run storybook
```

Now, you can open `<http://localhost:7007>` to view your storybook menus in the browser.

## Start App

To see your Storybook stories on the device, you should start your mobile app for the `<platform>` of your choice (typically `ios` or `android`). (Note that due to an implementation detail, your stories will only show up in the left pane of your browser window after your device has connected to this storybook server.)

For CRNA apps:

```sh
npm run <platform>
```

For RN apps:
```sh
react-native run-<platform>
```

Once your app is started, changing the selected story in web browser will update the story displayed within your mobile app.

If you are using Android and you get the following error after running the app: `'websocket: connection error', 'Failed to connect to localhost/127.0.0.1:7007'`, you have to forward the port 7007 on your device/emulator to port 7007 on your local machine with the following command:
`adb reverse tcp:7007 tcp:7007`

## Start Command Parameters

The following parameters can be passed to the start command:

```
-h, --host <host>
    host to listen on
-p, --port <port>
    port to listen on
--https
    whether server is running on https
-c, --config-dir [dir-name]
    storybook config directory
-e, --environment [environment]
    DEVELOPMENT/PRODUCTION environment for webpack
-i, --manual-id
    allow multiple users to work with same storybook
--smoke-test
    Exit after successful start
```

## getStorybookUI Options

You can pass these parameters to getStorybookUI call in your storybook entry point:

```
{
    onDeviceUI: Boolean (true)
        -- display navigator and addons on the device
    disableWebsockets: Boolean (false)
        -- allows to display stories without running storybook server. Should be used with onDeviceUI
    secured: Boolean (false)
        -- use wss/https instead of ws/http
    host: String (NativeModules.SourceCode.scriptURL)
        -- host to use
    port: Number (7007)
        -- port to use
    query: String ("")
        -- additional query string to pass to websockets
    isUIHidden: Boolean (false)
        -- should the ui be closed initialy.
    tabOpen: Number (0)
        -- which tab should be open. -1 Navigator, 0 Preview, 1 Addons
    initialSelection: Object (null)
        -- initialize storybook with a specific story. In case a valid object is passed, it will take precedence over `shouldPersistSelection. ex: `{ kind: 'Knobs', story: 'with knobs' }`
    shouldPersistSelection: Boolean (true)
        -- initialize storybook with the last selected story.
    shouldDisableKeyboardAvoidingView: Boolean (false)
        -- Disable KeyboardAvoidingView wrapping Storybook's view
    keyboardAvoidingViewVerticalOffset: Number (0)
        -- With shouldDisableKeyboardAvoidingView=true, this will set the keyboardverticaloffset (https://facebook.github.io/react-native/docs/keyboardavoidingview#keyboardverticaloffset) value for KeyboardAvoidingView wrapping Storybook's view
}
```

## Learn More

Check the `docs` directory in this repo for more advanced setup guides and other info.
