const theme = {
  appBorderColor: '#e0e0e0',
  barSelectedColor: '#1b71ba',
  color: { mediumdark: '#999999' },
  background: { content: '#ffffff' },
  textMutedColor: '#999999',
};

module.exports = {
  // `styled.X(styleFn)` returns a component; host names keep the elements renderable.
  styled: { Text: () => 'Text', TouchableOpacity: () => 'TouchableOpacity' },
  useTheme: jest.fn(() => theme),
};
