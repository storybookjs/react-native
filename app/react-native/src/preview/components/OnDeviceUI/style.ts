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
  previewMinimized: {
    borderWidth: 1,
    borderColor: '#b3b3b3',
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
