import { storiesOf } from '@storybook/polymer';
import '../../../../node_modules/@webcomponents/webcomponentsjs/webcomponents-loader';
import '../../../../node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter';

import '../PlaygroundButton.html';

storiesOf('Welcome', module).add('Welcome', () => '<playground-button></playground-button>');
