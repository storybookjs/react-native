import { styled } from '@storybook/ondevice-theme';

export const Header = styled.Text<{ selected: boolean }>(({ theme, selected }) => ({
  fontSize: 20,
  color: theme.headerTextColor,
  fontWeight: selected ? 'bold' : undefined,
}));

export const Name = styled.Text<{ selected: boolean }>(({ theme, selected }) => ({
  fontSize: 16,
  color: theme.headerTextColor,
  fontWeight: selected ? 'bold' : undefined,
}));

export const Label = styled.Text(({ theme }) => ({
  fontSize: 18,
  color: theme.labelColor,
}));
