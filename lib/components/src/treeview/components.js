import React from 'react';
import styled from 'react-emotion';

export const Container = styled('div')({
  background: `linear-gradient(to bottom, transparent, transparent 50%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1))`,
  backgroundSize: '100% 80px',
});
export const TreeWrapper = styled('div')({});
TreeWrapper.displayName = 'TreeWrapper';

export const ListWrapper = styled('div')({});
ListWrapper.displayName = 'ListWrapper';

export const A = styled('a')({
  height: 40,
  display: 'flex',
  alignItems: 'center',
});
A.displayName = 'A';

export const LeafStyle = styled('div')(({ isSelected, depth }) => ({
  background: isSelected ? '#CFD8DC' : 'transparent',
  height: 40,
  paddingLeft: 20 + depth * 20,
  display: 'flex',
  alignItems: 'center',
  flex: 1,
}));

export const DefaultLeaf = ({ name, depth, isSelected }) => (
  <LeafStyle isSelected={isSelected} depth={depth}>
    {name}
  </LeafStyle>
);
DefaultLeaf.displayName = 'DefaultLeaf';
export const DefaultHead = ({ name, depth, isExpanded = true, isSelected }) => (
  <LeafStyle isSelected={isSelected} depth={depth}>
    <strong>{name}</strong>
  </LeafStyle>
);
DefaultHead.displayName = 'DefaultHead';

export const Link = ({ href, children, path, ...rest }) => (
  <A href={href} {...rest}>
    {children}
  </A>
);
