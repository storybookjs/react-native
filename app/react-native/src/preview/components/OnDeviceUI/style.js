import { StyleSheet } from 'react-native';

export default {
  main: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 20,
    backgroundColor: 'rgba(247, 247, 247, 1)',
  },
  leftPanel: {
    flex: 1,
    maxWidth: 250,
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  rightPanel: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(236, 236, 236, 1)',
    borderRadius: 4,
    marginBottom: 8,
    marginHorizontal: 8,
  },
  preview: {
    ...StyleSheet.absoluteFillObject,
  },
};
