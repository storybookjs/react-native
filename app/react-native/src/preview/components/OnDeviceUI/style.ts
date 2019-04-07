import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  main: {
    flex: 1,
  },
  headerText: {
    marginLeft: 10,
    fontSize: 20,
    color: 'black',
  },
  text: {
    fontSize: 18,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  hideButtonText: {
    fontSize: 14,
    color: '#999999',
  },
  hideButton: {
    backgroundColor: 'transparent',
    position: 'absolute',
    right: 8,
    bottom: 12,
    zIndex: 100,
  },
  previewMinimized: {
    borderWidth: 1,
    borderColor: '#b3b3b3',
  },
  tab: {
    marginRight: 15,
  },
  addonList: {
    flexDirection: 'row',
  },
  invisible: {
    height: 0,
    width: 0,
    opacity: 0,
    position: 'absolute',
  },
  flex: {
    flex: 1,
  },
});
