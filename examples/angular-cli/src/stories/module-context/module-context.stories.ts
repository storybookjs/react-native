import { storiesOf, moduleMetadata } from '@storybook/angular';
import { withKnobs, text, object } from '@storybook/addon-knobs';
import { ChipsGroupComponent } from './chips-group.component';

import { ChipsModule } from './chips.module';
import { ChipComponent } from './chip.component';
import { CHIP_COLOR } from './chip-color.token';

storiesOf('Custom|Module Context', module)
  .addDecorator(withKnobs)
  .addDecorator(
    moduleMetadata({
      imports: [ChipsModule],
    })
  )
  .add(
    'Component with self and child component declared in its feature module',
    () => {
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
    },
    {
      notes: `
        This component includes a child component, a pipe, and a default provider, all which come from 
        the specified feature module.

        This behavior is possible by setting the "requiresComponentDeclaration" flag to false.
      `.replace(/ {1,}/g, ' '),
    }
  )
  .add('Component with default providers', () => {
    const props: { [K in keyof ChipComponent]?: any } = {
      displayText: text('Display Text', 'My Chip'),
    };
    return {
      component: ChipComponent,
      requiresComponentDeclaration: false,
      props,
    };
  })
  .add('Component with overridden provider', () => {
    const props: { [K in keyof ChipComponent]?: any } = {
      displayText: text('Display Text', 'My Chip'),
    };
    return {
      component: ChipComponent,
      moduleMetadata: {
        providers: [
          {
            provide: CHIP_COLOR,
            useValue: 'yellow',
          },
        ],
      },
      requiresComponentDeclaration: false,
      props,
    };
  });
