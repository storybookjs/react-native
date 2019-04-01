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

// Need to define Placeholder using old fashioned `function Placeholder` to avoid TS compiler to
// generate an anonymous function instead of naming it Placeholder...
// See https://github.com/storybooks/storybook/pull/6095#issuecomment-477480930
// tslint:disable-next-line:no-shadowed-variable
export const Placeholder: FunctionComponent = function Placeholder({ children, ...props }) {
  const [title, desc] = Children.toArray(children);
  return (
    <Message {...props}>
      <Title>{title}</Title>
      {desc && <Desc>{desc}</Desc>}
    </Message>
  );
};
