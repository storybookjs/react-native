import React from 'react';
import Button from './Button';
import { Meta, Story } from '@storybook/addon-docs/blocks';

<Meta
  title='Some.Button'
  decorators={[withKnobs, storyFn => <div className='foo'>{storyFn}</div>]} />

<Story name='with decorator'><Button label='The Button' /></Story>