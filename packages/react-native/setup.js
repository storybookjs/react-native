// eslint-disable-next-line no-undef
jest.doMock('react-native/Libraries/NativeComponent/ViewConfigIgnore', () => ({
  ConditionallyIgnoredEventHandlers: () => undefined,
  DynamicallyInjectedByGestureHandler: () => ({}),
  isIgnored: () => true,
}));
