import { Switch } from 'react-native';
import { styled } from '@storybook/react-native-theming';

export interface BooleanProps {
  onChange: (value: boolean) => void;
  arg: {
    name: string;
    value: boolean;
  };
}

const Container = styled.View(() => ({
  alignItems: 'flex-start',
}));

const BooleanType = ({ arg, onChange }: BooleanProps) => (
  <Container>
    <Switch testID={arg.name} onValueChange={() => onChange(!arg.value)} value={arg.value} />
  </Container>
);

BooleanType.serialize = (value) => (value ? String(value) : null);

BooleanType.deserialize = (value) => value === 'true';

export default BooleanType;
