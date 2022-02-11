import React from 'react';
import styled from '@emotion/native';

const ICON_BORDER = 2;

const GridIconContainer = styled.View(
  {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: ICON_BORDER,
    marginRight: 5,
  },
  ({ theme }) => ({ borderColor: theme.listItemActiveColor })
);
const VerticalLine = styled.View(
  {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '50%',
    width: ICON_BORDER,
    // I think this is a problem with Emotion :(
    transform: [{ translateX: -1 }],
  },
  ({ theme }) => ({ backgroundColor: theme.listItemActiveColor })
);
const HorizontalLine = styled.View(
  {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    height: ICON_BORDER,
    // I think this is a problem with Emotion :(
    transform: [{ translateY: -1 }],
  },
  ({ theme }) => ({ backgroundColor: theme.listItemActiveColor })
);

export const GridIcon = () => (
  <GridIconContainer>
    <VerticalLine />
    <HorizontalLine />
  </GridIconContainer>
);
