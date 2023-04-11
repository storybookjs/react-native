# Storybook server
Since storybook v5 the storybook server is a standalone package. To keep using storybook server make sure to install @storybook/react-native-server package.

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



