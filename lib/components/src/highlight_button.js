import styled from '@emotion/styled';

export default styled.button(
  {
    border: '1px solid rgba(0, 0, 0, 0)',
    font: 'inherit',
    background: 'none',
    boxShadow: 'none',
    padding: 0,
    ':hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      border: '1px solid #ccc',
    },
  },
  ({ highlight }) =>
    highlight
      ? [
          {
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            border: '1px solid #ccc',
          },
        ]
      : []
);
