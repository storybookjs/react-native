import { storiesOf } from '@storybook/react-native';
import { withKnobs } from '@storybook/addon-ondevice-knobs';
import knobsWrapper from '.';

storiesOf('Knobs', module).addDecorator(withKnobs).add('with knobs', knobsWrapper);
