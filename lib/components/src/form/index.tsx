import { styled } from '@storybook/theming';
import Field from './field/field';
import { Input, Select, Textarea, Button } from './input/input';

const Form = Object.assign(
  styled.form({
    boxSizing: 'border-box',
    width: '100%',
  }),
  {
    Field,
    Input,
    Select,
    Textarea,
    Button,
  }
);

export default Form;
