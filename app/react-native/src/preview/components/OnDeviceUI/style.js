import { StyleSheet } from 'react-native';

export default {
  main: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  icon: {
    width: 20,
    height: 20,
    opacity: 0.5,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5,
  },
  headerText: {
    marginLeft: 5,
    fontSize: 14,
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
    marginVertical: 5,
  },
  preview: {
    ...StyleSheet.absoluteFillObject,
  },
};
