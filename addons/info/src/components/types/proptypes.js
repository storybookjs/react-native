import PropTypes, { oneOfType } from 'prop-types';

export const TypeInfo = oneOfType([
  PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.any,
  }),
  PropTypes.string,
]);
