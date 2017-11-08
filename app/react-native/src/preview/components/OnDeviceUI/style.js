import { StyleSheet } from 'react-native-compat';

export default {
  main: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  icon: {
    width: 30,
    height: 30,
    opacity: 0.5,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  headerText: {
    marginLeft: 10,
    fontSize: 20,
    color: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    ...StyleSheet.absoluteFillObject,
    right: null,
    paddingHorizontal: 8,
    paddingBottom: 8,
    backgroundColor: 'rgba(247, 247, 247, 1)',
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
