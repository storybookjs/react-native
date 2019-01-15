import { styled } from '@storybook/theming';
import PropTypes from 'prop-types';

const Text = styled.p({
  color: 'inherit',
});

Text.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Text;
