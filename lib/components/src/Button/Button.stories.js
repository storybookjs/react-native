import React from 'react';
import { storiesOf } from '@storybook/react';
import Button from './Button';
import Icon from '../icon/icon';

import Form from '../form/index';

const { Button: FormButton } = Form;

storiesOf('Basics|Button', module).add('all buttons', () => (
  <div>
    <p>Button that is used for forms</p>
    <FormButton>Form.Button</FormButton>
    <br />
    <p>Buttons that are used for everything else</p>
    <Button primary>Primary</Button>
    <Button secondary>Secondary</Button>
    <Button outline containsIcon>
      <Icon icon="link" />
    </Button>
    <br />
    <Button outline>Outline</Button>
    <Button outline primary>
      Outline primary
    </Button>
    <Button outline secondary>
      Outline secondary
    </Button>
    <Button primary disabled>
      Disabled
    </Button>
    <br />
    <Button primary small>
      Primary
    </Button>
    <Button secondary small>
      Secondary
    </Button>
    <Button outline small>
      Outline
    </Button>
    <Button primary disabled small>
      Disabled
    </Button>
    <Button outline small containsIcon>
      <Icon icon="link" />
    </Button>
    <Button outline small>
      <Icon icon="link" />
      Link
    </Button>
  </div>
));
