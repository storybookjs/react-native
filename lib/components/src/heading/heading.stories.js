import React from 'react';
import { storiesOf } from '@storybook/react';
import styled from '@emotion/styled';

import Heading from './heading';

const Holder = styled.div({
  margin: 10,
  border: '1px dashed deepskyblue',
});

storiesOf('Components|Heading', module).add('types', () => (
  <div>
    <Holder>
      <Heading>DEFAULT WITH ALL CAPS</Heading>
    </Holder>
    <Holder>
      <Heading sub="With a great sub">THIS LONG DEFAULT WITH ALL CAPS & SUB</Heading>
    </Holder>
    <Holder>
      <Heading type="page">page type</Heading>
    </Holder>
    <Holder>
      <Heading type="page" sub="With a sub">
        page type
      </Heading>
    </Holder>
    <Holder>
      <Heading type="section">section type</Heading>
    </Holder>
    <Holder>
      <Heading type="section" mods={['uppercase']}>
        section type
      </Heading>
      <Heading type="section" mods={['underline']}>
        section type
      </Heading>
    </Holder>
  </div>
));
