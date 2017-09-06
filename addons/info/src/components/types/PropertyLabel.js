import PropTypes from 'prop-types';
import React from 'react';

const styles = {
  hasProperty: {
    whiteSpace: 'nowrap',
  },
};

const PropertyLabel = ({ property, required }) => {
  if (!property) return null;

  return (
    <span style={styles.hasProperty}>
      {property}
      {required ? '' : '?'}:{' '}
    </span>
  );
};

PropertyLabel.propTypes = {
  property: PropTypes.string,
  required: PropTypes.bool,
};

PropertyLabel.defaultProps = {
  property: '',
  required: false,
};

export default PropertyLabel;
