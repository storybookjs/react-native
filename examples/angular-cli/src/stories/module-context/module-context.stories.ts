import { storiesOf, moduleMetadata } from '@storybook/angular';
import { withKnobs, text, object } from '@storybook/addon-knobs';
import { ChipsGroupComponent } from './chips-group.component';

import { ChipsModule } from './chips.module';
import { ChipComponent } from './chip.component';

storiesOf('Custom|Module Context', module)
  .addDecorator(withKnobs)
  .addDecorator(
    moduleMetadata({
      imports: [ChipsModule],
    })
  )
  .add('Component with self and child component declared in its feature module', () => {
    const props: { [K in keyof ChipsGroupComponent]?: any } = {
      chips: object('Chips', [
        {
          id: 1,
          text: 'Chip 1',
        },
        {
          id: 2,
          text: 'Chip 2',
        },
      ]),
    };
    return {
      component: ChipsGroupComponent,
      requiresComponentDeclaration: false,
      props,
    };
  })
  .add('Child component', () => {
    const props: { [K in keyof ChipComponent]?: any } = {
      displayText: text('displayText', 'My Chip'),
    };
    return {
      component: ChipComponent,
      requiresComponentDeclaration: false,
      props,
    };
  });
