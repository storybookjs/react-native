import { storiesOf, moduleMetadata } from '@storybook/angular';
import { withKnobs, text, object } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import { ChipsModule } from './chips.module';
import { ChipsGroupComponent } from './chips-group.component';
import { ChipComponent } from './chip.component';
import { CHIP_COLOR } from './chip-color.token';

storiesOf('Custom|Feature Module as Context', module)
  .addDecorator(withKnobs)
  .addDecorator(
    moduleMetadata({
      imports: [ChipsModule],
    })
  )
  .add(
    'Component with self and dependencies declared in its feature module',
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
        removeChipClick: action('Remove chip'),
        removeAllChipsClick: action('Remove all chips clicked'),
      };
      return {
        component: ChipsGroupComponent,
        props,
      };
    },
    {
      notes: `This component includes a child component, a pipe, and a default provider, all which come from 
        the specified feature module.`,
    }
  )
  .add('Component with default providers', () => {
    const props: { [K in keyof ChipComponent]?: any } = {
      displayText: text('Display Text', 'My Chip'),
      removeClicked: action('Remove icon clicked'),
    };
    return {
      component: ChipComponent,
      props,
    };
  })
  .add('Component with overridden provider', () => {
    const props: { [K in keyof ChipComponent]?: any } = {
      displayText: text('Display Text', 'My Chip'),
      removeClicked: action('Remove icon clicked'),
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
      props,
    };
  });
