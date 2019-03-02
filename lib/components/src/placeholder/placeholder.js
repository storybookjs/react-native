import React, { Children } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@storybook/theming';

const Title = styled.div`
  font-weight: ${props => props.theme.typography.weight.bold};
`;

const Desc = styled.div``;

const Message = styled.div`
  padding: 30px;
  text-align: center;
  color: ${props => props.theme.color.defaultText};
  font-size: ${props => props.theme.typography.size.s2 - 1}px;
`;

export const Placeholder = ({ children, ...props }) => {
  const [title, desc] = Children.toArray(children);
  return (
    <Message {...props}>
      <Title>{title}</Title>
      {desc && <Desc>{desc}</Desc>}
    </Message>
  );
};

Placeholder.propTypes = {
  children: PropTypes.node.isRequired,
};

Placeholder.defaultProps = {};
