import React, { FunctionComponent, ReactNode } from 'react';
import { styled } from '@storybook/theming';

import { Link } from '../typography/link/link';

const Title = styled.div`
  font-weight: ${props => props.theme.typography.weight.black};
`;

const Desc = styled.span``;

const Links = styled.div`
  margin-top: 8px;
  text-align: center;

  > * {
    margin: 0 8px;
    font-weight: ${props => props.theme.typography.weight.black};
  }
`;

const Message = styled.div`
  color: ${props => props.theme.color.darker};
  line-height: 18px;
`;

const MessageWrapper = styled.div`
  padding: 15px;
  width: 280px;
  box-sizing: border-box;
`;

export interface TooltipMessageProps {
  title?: ReactNode;
  desc?: ReactNode;
  links?: {
    title: string;
    href?: string;
    onClick?: () => void;
  }[];
}

export const TooltipMessage: FunctionComponent<TooltipMessageProps> = ({ title, desc, links }) => {
  return (
    <MessageWrapper>
      <Message>
        {title && <Title>{title}</Title>}
        {desc && <Desc>{desc}</Desc>}
      </Message>
      {links && (
        <Links>
          {links.map(({ title: linkTitle, ...other }) => (
            <Link {...other} key={linkTitle}>
              {linkTitle}
            </Link>
          ))}
        </Links>
      )}
    </MessageWrapper>
  );
};

TooltipMessage.defaultProps = {
  title: null,
  desc: null,
  links: null,
};
