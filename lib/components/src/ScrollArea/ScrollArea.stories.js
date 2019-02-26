import React, { Fragment } from 'react';
import { styled } from '@storybook/theming';
import { ScrollArea } from './ScrollArea';

const Block = styled.span({
  display: 'inline-block',
  height: 40,
  width: 40,
  marginTop: 5,
  marginRight: 5,
  background: 'silver',
  lineHeight: '40px',
  textAlign: 'center',
  fontSize: 9,
});

const Wrapper = styled.div({
  whiteSpace: 'nowrap',
  lineHeight: '0px',
  maxWidth: 500,
  maxHeight: 500,
  overflow: 'hidden',
});

const list = filler => [...new Array(20)].map((x, i) => filler(i));

export default {
  component: ScrollArea,
  title: 'Basics|ScrollArea',
  decorators: [storyFn => <Wrapper>{storyFn()}</Wrapper>],
};

export const vertical = () => (
  <ScrollArea vertical>
    {list(i => (
      <Fragment key={i}>
        <Block>{i}</Block>
        <br />
      </Fragment>
    ))}
  </ScrollArea>
);

export const horizontal = () => (
  <ScrollArea horizontal>
    {list(i => (
      <Block key={i}>{i}</Block>
    ))}
  </ScrollArea>
);

export const both = () => (
  <ScrollArea horizontal vertical>
    {list(i => (
      <Fragment key={i}>
        {list(ii => (
          <Block key={ii}>{ii * i}</Block>
        ))}
        <br />
      </Fragment>
    ))}
  </ScrollArea>
);
