import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View, Text } from 'react-native';

const Swatch = ({ name, value, setBackground }) => (
  <TouchableOpacity
    style={{
      borderRadius: 4,
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,0.2)',
      marginTop: 10,
      marginBottom: 20,
      marginHorizontal: 10,
    }}
    onPress={() => setBackground(value)}
  >
    <View style={{ flex: 1, backgroundColor: value, height: 40 }} />
    <View style={{ padding: 4, flexDirection: 'row', justifyContent: 'space-between' }}>
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
