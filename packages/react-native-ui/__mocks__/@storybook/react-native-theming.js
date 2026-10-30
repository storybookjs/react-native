const theme = {
  background: { content: '#ffffff' },
  textMutedColor: '#999999',
};

module.exports = {
  useTheme: jest.fn(() => theme),
};
