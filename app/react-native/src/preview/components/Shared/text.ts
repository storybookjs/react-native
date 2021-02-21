import styled from '@emotion/native';

export const Header = styled.Text<{ selected: boolean }>(
  ({ theme }) => ({
    fontSize: 20,
    color: theme.headerTextColor || 'black',
  }),
  ({ selected }) => (selected ? { fontWeight: 'bold' } : {})
);

export const Name = styled.Text<{ selected: boolean }>(
  ({ theme }) => ({
    fontSize: 16,
    color: theme.headerTextColor || 'black',
  }),
  ({ selected }) => (selected ? { fontWeight: 'bold' } : {})
);

export const Label = styled.Text(({ theme }) => ({
  fontSize: 18,
  color: theme.labelColor || 'black',
}));
