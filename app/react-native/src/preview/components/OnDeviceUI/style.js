import { StyleSheet } from 'react-native';

export default {
  main: {
    flex: 1,
    paddingTop: 20,
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
  overlayContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  menuContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: -250,
    width: 250,
    paddingHorizontal: 8,
    paddingTop: 20,
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
