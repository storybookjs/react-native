import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@storybook/theming';

const Title = styled.div`
  font-weight: ${props => props.theme.typography.weight.bold};
`;

const Desc = styled.div``;

const Message = styled.div`
  padding: 30px;
  text-align: center;
  color: ${props => props.theme.color.dark};
  font-size: ${props => props.theme.typography.size.s2}px;
`;

export default function Placeholder({ title, children, ...props }) {
  return (
    <Message {...props}>
      {title && <Title>{title}</Title>}
      {children && <Desc>{children}</Desc>}
    </Message>
  );
}

Placeholder.propTypes = {
  title: PropTypes.node,
  children: PropTypes.node,
};

Placeholder.defaultProps = {
  title: null,
  children: null,
};
