import { styled } from '@storybook/react-native-theming';
import { transparentize } from 'polished';
import type { SectionLevel } from '../controlArgTypes';

interface SectionRowProps {
  label: string;
  level: SectionLevel;
  itemCount: number;
  expanded: boolean;
  hasBottomBorder: boolean;
  onToggle: () => void;
}

const Row = styled.TouchableOpacity<{ hasBottomBorder: boolean }>(({ theme, hasBottomBorder }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  columnGap: 10,
  paddingVertical: 10,
  paddingHorizontal: 20,
  backgroundColor: theme.background.app,
  borderBottomWidth: hasBottomBorder ? 1 : 0,
  borderBottomColor: hasBottomBorder ? theme.appBorderColor : undefined,
}));

const Chevron = styled.View<{ expanded: boolean }>(({ theme, expanded }) => ({
  width: 6,
  height: 6,
  marginEnd: 2,
  borderRightWidth: 1.5,
  borderBottomWidth: 1.5,
  borderColor:
    theme.base === 'light'
      ? transparentize(0.25, theme.color.defaultText)
      : transparentize(0.3, theme.color.defaultText),
  transform: [{ rotate: expanded ? '45deg' : '-45deg' }],
}));

const SectionLabel = styled.Text(({ theme }) => ({
  flex: 1,
  fontSize: theme.typography.size.s1 - 1,
  fontWeight: 'bold',
  letterSpacing: 3,
  textTransform: 'uppercase',
  color:
    theme.base === 'light'
      ? transparentize(0.4, theme.color.defaultText)
      : transparentize(0.6, theme.color.defaultText),
}));

const SubsectionLabel = styled.Text(({ theme }) => ({
  flex: 1,
  fontSize: theme.typography.size.s2 - 1,
  fontWeight: 'bold',
  color: theme.color.defaultText,
}));

const Caption = styled.Text(({ theme }) => ({
  fontSize: theme.typography.size.s1,
  color: theme.textMutedColor,
}));

/**
 * Header for a group of controls created with `table.category` (a section) or `table.subcategory`
 * (a subsection). Pressing it collapses or expands the rows in the group, like the web Controls
 * panel.
 */
const SectionRow = ({
  label,
  level,
  itemCount,
  expanded,
  hasBottomBorder,
  onToggle,
}: SectionRowProps) => {
  const Label = level === 'section' ? SectionLabel : SubsectionLabel;
  const itemCountText = `${itemCount} item${itemCount === 1 ? '' : 's'}`;

  return (
    <Row
      hasBottomBorder={hasBottomBorder}
      activeOpacity={0.7}
      onPress={onToggle}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={`${expanded ? 'Hides' : 'Shows'} ${itemCountText}`}
      accessibilityState={{ expanded }}
    >
      <Chevron expanded={expanded} />
      <Label numberOfLines={1}>{label}</Label>
      {expanded ? null : <Caption>{itemCountText}</Caption>}
    </Row>
  );
};

export default SectionRow;
