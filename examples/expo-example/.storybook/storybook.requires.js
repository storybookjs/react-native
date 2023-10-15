/* do not change this file, it is auto generated by storybook. */

import { start } from "@storybook/react-native";

import "@storybook/addon-ondevice-notes/register";
import "@storybook/addon-ondevice-controls/register";
import "@storybook/addon-ondevice-knobs/register";
import "@storybook/addon-ondevice-backgrounds/register";
import "@storybook/addon-ondevice-actions/register";

const normalizedStories = [
  {
    titlePrefix: "",
    directory: "./components",
    files: "**/*.stories.?(ts|tsx|js|jsx)",
    importPathMatcher:
      /^\.(?:(?:^|\/|(?:(?:(?!(?:^|\/)\.).)*?)\/)(?!\.)(?=.)[^/]*?\.stories\.(?:ts|tsx|js|jsx)?)$/,
    req: require.context(
      "../components",
      true,
      /^\.(?:(?:^|\/|(?:(?:(?!(?:^|\/)\.).)*?)\/)(?!\.)(?=.)[^/]*?\.stories\.(?:ts|tsx|js|jsx)?)$/
    ),
  },
  {
    titlePrefix: "",
    directory: "./other_components/AnotherButton",
    files: "AnotherButton.stories.tsx",
    importPathMatcher: /^\.[\\/](?:AnotherButton\.stories\.tsx)$/,
    req: require.context(
      "../other_components/AnotherButton",
      false,
      /^\.[\\/](?:AnotherButton\.stories\.tsx)$/
    ),
  },
];

global.STORIES = normalizedStories;

export const view = start({
  annotations: [
    require("./preview"),
    require("@storybook/addon-actions/dist/preview"),
  ],
  storyEntries: normalizedStories,
});
