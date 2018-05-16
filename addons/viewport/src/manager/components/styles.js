import styled from 'react-emotion';

export const Row = styled('div')({
  width: '100%',
  display: 'flex',
  marginBottom: 15,
});

export const Label = styled('label')({
  width: 80,
  marginRight: 15,
});

const actionColor = 'rgb(247, 247, 247)';

const basebutton = {
  color: 'rgb(85, 85, 85)',
  width: '100%',
  border: `1px solid ${actionColor}`,
  backgroundColor: actionColor,
  borderRadius: 4,
  padding: 10,
};

export const Button = styled('button')(
  basebutton,
  ({ disabled }) =>
    disabled
      ? {
          opacity: '0.5',
          cursor: 'not-allowed',
        }
      : {}
);

export const Select = styled('select')(basebutton);
