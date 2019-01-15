import PropTypes from 'prop-types';

import { styled } from '@storybook/theming';

const Indicator = styled.div(
  ({ color, size }) => ({
    boxSizing: 'border-box',
    padding: `0 ${size / 2}px`,
    minWidth: size,
    minHeight: size,
    fontSize: size / 1.4,
    lineHeight: `${size}px`,
    color: 'white',
    textTransform: 'uppercase',
    borderRadius: size / 2,
    backgroundColor: color,
  }),
  ({ overrides }) => ({
    ...overrides,
  })
);

Indicator.defaultProps = {
  right: false,
  children: '',
};

Indicator.propTypes = {
  color: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  children: PropTypes.node,
  right: PropTypes.bool,
};

export default Indicator;
