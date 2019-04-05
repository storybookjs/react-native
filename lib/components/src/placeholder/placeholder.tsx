import React, { Children, FunctionComponent } from 'react';
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

export const Placeholder: FunctionComponent = ({ children, ...props }) => {
  const [title, desc] = Children.toArray(children);
  return (
    <Message {...props}>
      <Title>{title}</Title>
      {desc && <Desc>{desc}</Desc>}
    </Message>
  );
};
