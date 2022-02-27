import React from 'react';
import { Image, StyleSheet } from 'react-native';

export const GridIcon = () => {
  return <Image source={require('../../../assets/icons/grid-icon.png')} style={styles.gridIcon} />;
};

const styles = StyleSheet.create({
  gridIcon: {
    width: 18,
    height: 18,
    marginRight: 5,
  },
});
