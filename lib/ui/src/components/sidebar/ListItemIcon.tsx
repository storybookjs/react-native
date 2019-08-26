import React from 'react';
import { styled, css } from '@storybook/theming';
import { Icons } from '@storybook/components';

const sharedStyles = css`
  height: 10px;
  width: 10px;
  margin-left: -5px;
  margin-right: -5px;
  display: block;
`;

const Icon = styled(Icons)`
  ${sharedStyles};
  color: ${props => props.theme.color.secondary};
`;

const Img = styled.img`
  ${sharedStyles};
`;

const Placeholder = styled.div`
  ${sharedStyles};
`;

export interface ListItemIconProps {
  icon?: React.ComponentProps<typeof Icons>['icon'];
  imgSrc?: string;
}

const ListItemIcon = ({ icon, imgSrc }: ListItemIconProps) => {
  if (icon) {
    return <Icon icon={icon} />;
  }
  if (imgSrc) {
    return <Img src={imgSrc} alt="image" />;
  }
  return <Placeholder />;
};

export default ListItemIcon;
