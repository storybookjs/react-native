// Minimal stand-ins for the sheet components, so tests can inspect the props Storybook passes
// without gesture-handler/reanimated running. The sheet renders its children so the inner
// components still mount; the scroll view stops there and only records its props.
const { createElement, Fragment } = require('react');

const renderChildren = () => jest.fn(({ children }) => createElement(Fragment, null, children));

module.exports = {
  __esModule: true,
  default: renderChildren(),
  BottomSheetBackdrop: jest.fn(() => null),
  BottomSheetScrollView: jest.fn(() => null),
};
