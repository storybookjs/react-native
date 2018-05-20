import { storiesOf } from '@storybook/marko';
import Welcome from './components/welcome/index.marko';

storiesOf('Welcome', module).add('welcome', () => Welcome.renderSync({}));
