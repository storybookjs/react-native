module.exports = {
  Keyboard: { dismiss: jest.fn() },
  Platform: { OS: 'ios' },
  Text: 'Text',
  View: 'View',
  useWindowDimensions: jest.fn(() => ({ width: 390, height: 844, scale: 3, fontScale: 1 })),
};
