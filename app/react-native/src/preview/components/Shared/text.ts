import styled from '@emotion/native';

export const Header = styled.Text<{ selected: boolean }>(
  ({ theme }) => ({
    fontSize: 18,
    color: theme.headerTextColor || 'black',
  }),
  ({ selected }) => (selected ? { fontWeight: 'bold' } : {})
);

export const Name = styled.Text<{ selected: boolean }>(
  {
    fontSize: 16,
  },
  ({ selected, theme }) =>
    selected ? { fontWeight: 'bold', color: 'white' } : { color: theme.headerTextColor || 'black' }
);

export const Label = styled.Text(({ theme }) => ({
  fontSize: 18,
  color: theme.labelColor || 'black',
}));
