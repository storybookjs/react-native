import { storiesOf, moduleMetadata } from '@storybook/angular';
import { ChipsGroupComponent } from './chips-group.component';
import { ChipsModule } from './chips.module';
import { ChipComponent } from './chip.component';

storiesOf('Custom|Module Context', module)
  .addDecorator(
    moduleMetadata({
      imports: [ChipsModule],
    })
  )
  .add('Component with self and child component declared in its feature module', () => ({
    component: ChipsGroupComponent,
    requiresComponentDeclaration: false,
    props: {
      chips: [
        {
          id: 1,
          text: 'Chip 1',
        },
        {
          id: 2,
          text: 'Chip 2',
        },
      ],
    },
  }))
  .add('Child component', () => ({
    component: ChipComponent,
    requiresComponentDeclaration: false,
    props: {
      text: 'My Chip',
    },
  }));
