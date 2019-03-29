import { storiesOf, moduleMetadata } from '@storybook/angular';
import { ChipsGroupComponent } from './chips-group.component';
import { ChipsModule } from './chips.module';

storiesOf('Custom|Module Context', module)
  .addDecorator(
    moduleMetadata({
      imports: [ChipsModule],
    })
  )
  .add('to Storybook', () => ({
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
  }));
