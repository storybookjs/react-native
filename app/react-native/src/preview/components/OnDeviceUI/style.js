import { StyleSheet } from 'react-native';

export default {
  main: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: 'rgba(247, 247, 247, 1)',
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
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(236, 236, 236, 1)',
    borderRadius: 4,
    marginBottom: 8,
    marginHorizontal: 8,
  },
  openMenuButton: {
    position: 'absolute',
    top: 20,
    left: 10,
    backgroundColor: 'transparent',
  },
  preview: {
    ...StyleSheet.absoluteFillObject,
  },
};
