import glamorous from 'glamorous';
import { Button as BaseButton } from '@storybook/components';

export const Actions = glamorous.pre({
  flex: 1,
  margin: 0,
  padding: '8px 2px 20px 0',
  overflowY: 'auto',
  color: '#666',
});

export const Action = glamorous.div({
  display: 'flex',
  padding: '3px 3px 3px 0',
  borderLeft: '5px solid white',
  borderBottom: '1px solid #fafafa',
  transition: 'all 0.1s',
  alignItems: 'start',
});

export const Button = glamorous(BaseButton)({
  position: 'absolute',
  bottom: 0,
  right: 0,
  borderRadius: '4px 0 0 0',
  textTransform: 'uppercase',
  letterSpacing: 1,
  paddingTop: 5,
  paddingBootom: 5,
});

export const Counter = glamorous.div({
  margin: '0 5px 0 5px',
  backgroundColor: '#777777',
  color: '#ffffff',
  padding: '1px 5px',
  borderRadius: '20px',
});

export const Countwrap = glamorous.div({
  paddingBottom: 2,
});

export const InspectorContainer = glamorous.div({
  flex: 1,
  padding: '0 0 0 5px',
});

export const Wrapper = glamorous.div({
  flex: 1,
  display: 'flex',
  position: 'relative',
});
