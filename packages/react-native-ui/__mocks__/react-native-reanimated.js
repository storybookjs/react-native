module.exports = {
  useAnimatedKeyboard: jest.fn(),
  useAnimatedStyle: jest.fn(() => ({})),
  useReducedMotion: jest.fn(() => false),
  useSharedValue: jest.fn((initial) => ({ value: initial })),
};
