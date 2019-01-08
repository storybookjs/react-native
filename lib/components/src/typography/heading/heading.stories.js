import React from 'react';
import { storiesOf } from '@storybook/react';
import styled from '@emotion/styled';

import Typography from '../index';

const Holder = styled.div({
  margin: 10,
  border: '1px dashed deepskyblue',
});

storiesOf('Components|Typography/Heading', module).add('types', () => (
  <div>
    <Holder>
      <Typography.Heading>DEFAULT WITH ALL CAPS</Typography.Heading>
    </Holder>
    <Holder>
      <Typography.Heading sub="With a great sub">
        THIS LONG DEFAULT WITH ALL CAPS & SUB
      </Typography.Heading>
    </Holder>
    <Holder>
      <Typography.Heading type="page">page type</Typography.Heading>
    </Holder>
    <Holder>
      <Typography.Heading type="secondary">secondary type</Typography.Heading>
    </Holder>
    <Holder>
      <Typography.Heading type="page" sub="With a sub">
        page type
      </Typography.Heading>
    </Holder>
    <Holder>
      <Typography.Heading type="section">section type</Typography.Heading>
    </Holder>
    <Holder>
      <Typography.Heading type="section" mods={['uppercase']}>
        section type
      </Typography.Heading>
      <Typography.Heading type="section" mods={['underline']}>
        section type
      </Typography.Heading>
    </Holder>
  </div>
));
