export const row = {
  width: '100%',
  display: 'flex',
  marginBottom: 15,
};

export const label = {
  width: 80,
  marginRight: 15,
};

const actionColor = 'rgb(247, 247, 247)';

export const button = {
  color: 'rgb(85, 85, 85)',
  width: '100%',
  border: `1px solid ${actionColor}`,
  backgroundColor: actionColor,
  borderRadius: 3,
};

export const disabled = {
  opacity: '0.5',
  cursor: 'not-allowed',
};

export const action = {
  ...button,
  height: 30,
};
