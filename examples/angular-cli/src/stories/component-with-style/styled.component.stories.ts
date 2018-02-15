import { storiesOf } from '@storybook/angular';
import { StyledComponent } from './styled.component';

storiesOf('Component styles', module).add('Component with styles', () => ({
  component: StyledComponent,
}));
