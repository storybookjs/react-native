import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SwatchProps {
  name: string;
  value: string;
  setBackground: (background: string) => void;
}

const Swatch = ({ name, value, setBackground }: SwatchProps) => (
  <TouchableOpacity style={styles.container} onPress={() => setBackground(value)}>
    <View style={[styles.color, { backgroundColor: value }]} />
    <View style={styles.valueContainer}>
      <Text>{name}:</Text>
      <Text>{value}</Text>
    </View>
  </TouchableOpacity>
);

Swatch.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  setBackground: PropTypes.func.isRequired,
};

export default Swatch;

const styles = StyleSheet.create({
  valueContainer: {
    padding: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  color: { flex: 1, height: 40 },
  container: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    marginTop: 10,
    marginBottom: 20,
    marginHorizontal: 10,
  },
});
