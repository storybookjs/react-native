import styled from '@emotion/styled';
import PropTypes from 'prop-types';

const Text = styled.p({
  color: 'inherit',
});

Text.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Text;
