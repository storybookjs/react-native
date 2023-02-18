import styled from '@emotion/native';

export const Header = styled.Text<{ selected: boolean }>(
  ({ theme }) => ({
    fontSize: 16,
    color: theme.headerTextColor || 'black',
    fontWeight: '500',
  }),
);

export const Name = styled.Text<{ selected: boolean }>(
  {
    fontSize: 16,
  },
  ({ selected, theme }) =>
    selected
      ? { fontWeight: '700', color: theme.listItemActiveTextColor ?? 'white' }
      : { color: theme.listItemTextColor ?? 'black' }
);

export const Label = styled.Text(({ theme }) => ({
  fontSize: 18,
  color: theme.labelColor || 'black',
}));
