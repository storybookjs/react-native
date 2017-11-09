import { StyleSheet } from 'react-native-compat';

export default {
  main: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  icon: {
    width: 30,
    height: 30,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  headerText: {
    marginLeft: 10,
    fontSize: 20,
    color: 'black',
  },
  menuContainer: {
    ...StyleSheet.absoluteFillObject,
    right: null,
    paddingHorizontal: 10,
    paddingBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  previewContainer: {
    flex: 1,
  },
  previewWrapper: {
    flex: 1,
  },
  closeButton: {
    marginVertical: 10,
  },
  preview: {
    ...StyleSheet.absoluteFillObject,
  },
};
