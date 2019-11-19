import React, { FunctionComponent } from 'react';
import { DocsPageProps } from './shared';
import { Title } from './Title';
import { Subtitle } from './Subtitle';
import { Description } from './Description';
import { Primary } from './Primary';
import { PrimaryProps } from './PrimaryProps';
import { Stories } from './Stories';

export const DocsPage: FunctionComponent<DocsPageProps> = ({
  titleSlot,
  subtitleSlot,
  descriptionSlot,
  primarySlot,
  propsSlot,
  storiesSlot,
}) => (
  <>
    <Title slot={titleSlot} />
    <Subtitle slot={subtitleSlot} />
    <Description slot={descriptionSlot} />
    <Primary slot={primarySlot} />
    <PrimaryProps slot={propsSlot} />
    <Stories slot={storiesSlot} />
  </>
);
