import React from 'react';
import styled from 'react-emotion';

import Icons from '../icons/util/index';

export const Container = styled('div')(({ theme }) => ({
  background: `linear-gradient(to bottom, ${theme.asideStripe}, ${
    theme.asideStripe
  } 50%, transparent 50%, transparent)`,
  backgroundSize: '100% 80px',
}));
export const TreeWrapper = styled('div')({});
TreeWrapper.displayName = 'TreeWrapper';

export const ListWrapper = styled('div')({});
ListWrapper.displayName = 'ListWrapper';

export const A = styled('a')({
  height: 40,
  display: 'flex',
  alignItems: 'center',
  color: 'inherit',
});
A.displayName = 'A';

export const LeafStyle = styled('div')(({ isSelected, depth }) => ({
  background: isSelected ? '#CFD8DC' : 'transparent',
  height: 40,
  paddingLeft: 10 + depth * 20,
  display: 'flex',
  alignItems: 'center',
  flex: 1,
}));

const RotatingChevron = styled(Icons.ChevronRight)(
  {
    transition: 'transform .1s linear',
    marginRight: 10,
  },
  ({ rotate }) =>
    rotate
      ? {
          transform: 'rotateZ(90deg)',
        }
      : {}
);

export const DefaultLeaf = ({ name, depth, isSelected }) => (
  <LeafStyle isSelected={isSelected} depth={depth}>
    {name}
  </LeafStyle>
);
DefaultLeaf.displayName = 'DefaultLeaf';
export const DefaultHead = ({ name, depth, isExpanded = true, isSelected }) => (
  <LeafStyle isSelected={isSelected} depth={depth}>
    <RotatingChevron rotate={isExpanded} />
    <strong>{name}</strong>
  </LeafStyle>
);
DefaultHead.displayName = 'DefaultHead';

export const Link = ({ href, children, path, ...rest }) => (
  <A href={href} {...rest}>
    {children}
  </A>
);
