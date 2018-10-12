# Storybook server
The default usage of React Native Storybook till version 4 involved starting Storybook server.
Starting from v4 we do not expect user to start the server since in most cases it is not really necessary.

In case you still want to run Storybook server simply call `npm run storybook` or `npx storybook start`.

## Benefits of storybook server

* ### Websockets connection
The main benefit you get from running storybook server is that your app will be listening for websockets connection.
That means that you can create your own tools that integrate with your storybook app.

* ### IDE Plugins
Having server running allows you to control your storybook view from inside web page or your ide.

There is a plugin for [JetBrains IDEs](https://plugins.jetbrains.com/plugin/9910-storybook) and there is one 
for [VS Code](https://github.com/orta/vscode-react-native-storybooks).


* ### Web addons
There are Storybook addons that work with React Native but do not have on device implementations.



