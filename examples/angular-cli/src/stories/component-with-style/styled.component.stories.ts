import { storiesOf } from '@storybook/angular';
import { StyledComponent } from './styled.component';

storiesOf('Custom|styleUrls', module).add('Component with styles', () => ({
  component: StyledComponent,
}));
