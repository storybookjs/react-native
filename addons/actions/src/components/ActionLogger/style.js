import styled from '@emotion/styled';

export const Actions = styled.pre({
  flex: 1,
  margin: 0,
  padding: '8px 2px 20px 0',
  overflowY: 'auto',
  color: '#666',
});

export const Action = styled.div({
  display: 'flex',
  padding: '3px 3px 3px 0',
  borderLeft: '5px solid transparent',
  borderBottom: '1px solid transparent',
  transition: 'all 0.1s',
  alignItems: 'start',
});

export const Counter = styled.div({
  margin: '0 5px 0 5px',
  backgroundColor: '#777777',
  color: '#ffffff',
  padding: '1px 5px',
  borderRadius: '20px',
});

export const Countwrap = styled.div({
  paddingBottom: 2,
});

export const InspectorContainer = styled.div({
  flex: 1,
  padding: '0 0 0 5px',
});

export const Wrapper = styled.div({
  flex: 1,
  display: 'flex',
  position: 'relative',
  height: '100%',
});
