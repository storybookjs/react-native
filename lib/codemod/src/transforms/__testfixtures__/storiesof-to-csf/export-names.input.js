/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import styled from 'styled-components';

import FlexCenter from './FlexCenter';
import { specs, urls } from './LiveView.stories';
import { ignoredRegions } from './IgnoredRegions.stories';

export { specs, urls, ignoredRegions };

const CanvasWrapper = styled.div`
  width: 50%;
`;

storiesOf('Webapp components/FlexCenter', module)
  .addDecorator(storyFn => <CanvasWrapper>{storyFn()}</CanvasWrapper>)
  .add('2:1', () => (
    <FlexCenter width={200} height={100} style={{ background: 'papayawhip' }}>
      <div style={{ padding: 30, background: 'hotpink' }}>2:1</div>
    </FlexCenter>
  ))
  .add('2:2', () => (
    <FlexCenter width={200} height={200} style={{ background: 'papayawhip' }}>
      <div style={{ padding: 30, background: 'hotpink' }}>2:2</div>
    </FlexCenter>
  ))
  .add('2:3', () => (
    <FlexCenter width={200} height={300} style={{ background: 'papayawhip' }}>
      <div style={{ padding: 30, background: 'hotpink' }}>2:3</div>
    </FlexCenter>
  ));
