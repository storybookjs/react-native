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
        Typically, when developing features in Angular, it is advantageous to use "feature modules"
        which provide a "context" for declared components including required imports, declarations,
        and providers.

        To simulate this context in Storybook, we may want to use the component delcared in this
        context, rather than having to recreate this context using just to get the component to
        perform its basic functionality.

        However, as the default behavior of Storkybook for Angular is to delcare specified components
        in a dynamic module, which prevents us from using the version of the component declared in our
        feature module (with its appropriate context).

        To prevent this dynamic declaration, set the "requiresComponentDeclaration" flag to false.
      `,
    }
  )
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
