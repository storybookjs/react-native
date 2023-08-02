import * as React from 'react';
import { makeDecorator } from '@storybook/preview-api';
import { addons } from '@storybook/manager-api';

import Events from './constants';
import Container from './container';

export interface Background {
  name: string;
  value: string;
}

export const withBackgrounds = makeDecorator({
  name: 'withBackgrounds',
  parameterName: 'backgrounds',
  skipIfNoParametersOrOptions: true,

  wrapper: (getStory, context, { options, parameters }) => {
    const data = (parameters || options || { values: [] }) as {
      default?: string;
      values: Background[];
    };
    const backgrounds: Background[] = data.values;

    let background = 'transparent';
    if (backgrounds.length !== 0) {
      addons.getChannel().emit(Events.SET, backgrounds);
      const defaultValue = data.default
        ? backgrounds.find((b) => b.name === data.default)
        : undefined;
      const defaultOrFirst = defaultValue ? defaultValue : backgrounds[0];

      if (defaultOrFirst) {
        background = defaultOrFirst.value;
      }
    }

    return (
      <Container initialBackground={background} channel={addons.getChannel()}>
        {getStory(context) as React.ReactNode}
      </Container>
    );
  },
});
