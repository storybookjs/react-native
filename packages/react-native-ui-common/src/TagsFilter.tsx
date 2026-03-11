import { Portal } from '@gorhom/portal';
import { styled } from '@storybook/react-native-theming';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, useWindowDimensions, View, ViewStyle } from 'react-native';
import type { API_IndexHash } from 'storybook/internal/types';
import { Button } from './Button';
import {
  type SidebarTagSelection,
  createSidebarTagFilters,
  getVisibleSidebarTagFilters,
  hasActiveSidebarTagSelection,
} from './util/tags';

const Wrapper = styled.View<{ compact?: boolean }>(({ compact }) => ({
  marginBottom: compact ? 0 : 8,
}));

const TriggerWrapper = styled.View({
  alignItems: 'flex-start',
});

const SelectedDot = styled.View(({ theme }) => ({
  position: 'absolute',
  top: 5,
  right: 5,
  width: 6,
  height: 6,
  borderRadius: 999,
  backgroundColor: theme.color.secondary,
}));

const Panel = styled.View(({ theme }) => ({
  borderWidth: 1,
  borderColor: theme.appBorderColor,
  borderRadius: 8,
  padding: 8,
  backgroundColor: theme.background.content,
  gap: 8,
  boxShadow: `0 8px 24px 0 ${theme.color.border}`,
  elevation: 12,
}));

const PanelHeader = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 8,
});

const HeaderActions = styled.View({
  minWidth: 56,
  alignItems: 'flex-end',
});

const PanelTitle = styled.Text(({ theme }) => ({
  color: theme.color.defaultText,
  fontSize: theme.typography.size.s1,
  fontWeight: theme.typography.weight.bold,
}));

const EmptyText = styled.Text(({ theme }) => ({
  color: theme.textMutedColor,
  fontSize: theme.typography.size.s1,
  lineHeight: 18,
}));

const FiltersScrollView = styled(ScrollView)({
  maxHeight: 220,
});

const FilterRow = styled.View({
  minHeight: 40,
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
  paddingVertical: 4,
});

const FilterToggle = styled.TouchableOpacity({
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
  minHeight: 32,
});

const Checkbox = styled.View<{ checked: boolean }>(({ theme, checked }) => ({
  width: 18,
  height: 18,
  borderRadius: 4,
  borderWidth: 1,
  borderColor: checked ? theme.color.secondary : theme.appBorderColor,
  backgroundColor: checked ? theme.color.secondary : 'transparent',
  alignItems: 'center',
  justifyContent: 'center',
}));

const Checkmark = styled.Text<{ checked: boolean }>(({ theme, checked }) => ({
  color: checked ? theme.color.lightest : theme.color.defaultText,
  fontSize: theme.typography.size.s1 - 1,
  fontWeight: theme.typography.weight.bold,
}));

const FilterMeta = styled.View({
  flex: 1,
  gap: 2,
});

const FilterTitleRow = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  gap: 4,
});

const FilterTitle = styled.Text(({ theme }) => ({
  color: theme.color.defaultText,
  fontSize: theme.typography.size.s1,
}));

const FilterCount = styled.Text(({ theme }) => ({
  color: theme.textMutedColor,
  fontSize: theme.typography.size.s1 - 1,
}));

const ExcludedLabel = styled.Text(({ theme }) => ({
  color: theme.textMutedColor,
  fontSize: theme.typography.size.s1 - 1,
}));

const ExcludedCount = styled.Text(({ theme }) => ({
  color: theme.textMutedColor,
  fontSize: theme.typography.size.s1 - 1,
  textDecorationLine: 'line-through',
}));

const RowActions = styled.View({
  width: 72,
  alignItems: 'flex-end',
});

const PopoverContainer = styled.View({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1000,
});

const Backdrop = styled(Pressable)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
});

const PANEL_GAP = 8;
const SCREEN_PADDING = 8;
const PANEL_WIDTH = 300;
const COMPACT_TRIGGER_SIZE = 24;
const compactTriggerHitSlop = { top: 6, right: 6, bottom: 6, left: 6 };
const filtersScrollViewStyle = {
  marginRight: -6,
} satisfies ViewStyle;
const filtersScrollContentStyle = {
  paddingRight: 6,
} satisfies ViewStyle;
const compactTriggerStyle = {
  width: COMPACT_TRIGGER_SIZE,
  height: COMPACT_TRIGGER_SIZE,
  paddingHorizontal: 0,
} satisfies ViewStyle;

type TagsFilterProps = {
  storiesHash?: API_IndexHash;
  selection: SidebarTagSelection;
  onSelectionChange: (selection: SidebarTagSelection) => void;
  compact?: boolean;
  TriggerIcon?: (props: {
    color?: string;
    width?: number;
    height?: number;
    size?: number;
  }) => React.ReactElement;
};

export const TagsFilter = React.memo(function TagsFilter({
  storiesHash,
  selection,
  onSelectionChange,
  compact = false,
  TriggerIcon,
}: TagsFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [anchorRect, setAnchorRect] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const triggerRef = useRef<View>(null);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const filtersById = useMemo(() => createSidebarTagFilters(storiesHash), [storiesHash]);
  const filters = useMemo(() => getVisibleSidebarTagFilters(filtersById), [filtersById]);
  const activeCount = selection.included.size + selection.excluded.size;
  const hasActiveSelection = hasActiveSidebarTagSelection(selection);

  const measureTrigger = useCallback(() => {
    triggerRef.current?.measure((_x, _y, width, height, pageX, pageY) => {
      setAnchorRect({ x: pageX, y: pageY, width, height });
    });
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      measureTrigger();
    });

    return () => cancelAnimationFrame(frame);
  }, [isOpen, measureTrigger, windowHeight, windowWidth]);

  const updateSelection = useCallback(
    (id: string) => {
      const included = new Set(selection.included);
      const excluded = new Set(selection.excluded);

      if (included.has(id)) {
        included.delete(id);
      } else {
        included.add(id);
        excluded.delete(id);
      }

      onSelectionChange({ included, excluded });
    },
    [onSelectionChange, selection.excluded, selection.included]
  );

  const toggleExcluded = useCallback(
    (id: string) => {
      const included = new Set(selection.included);
      const excluded = new Set(selection.excluded);

      if (excluded.has(id)) {
        excluded.delete(id);
      } else {
        excluded.add(id);
        included.delete(id);
      }

      onSelectionChange({ included, excluded });
    },
    [onSelectionChange, selection.excluded, selection.included]
  );

  const clearSelection = useCallback(() => {
    onSelectionChange({ included: new Set<string>(), excluded: new Set<string>() });
  }, [onSelectionChange]);

  const popoverStyle = useMemo<ViewStyle | undefined>(() => {
    if (!anchorRect) {
      return undefined;
    }

    const width = Math.min(PANEL_WIDTH, windowWidth - SCREEN_PADDING * 2);
    const left = Math.min(
      Math.max(SCREEN_PADDING, anchorRect.x),
      windowWidth - width - SCREEN_PADDING
    );
    const top = Math.min(
      Math.max(SCREEN_PADDING, anchorRect.y + anchorRect.height + PANEL_GAP),
      windowHeight - SCREEN_PADDING
    );

    return {
      position: 'absolute',
      top,
      left,
      width,
      maxHeight: Math.max(180, windowHeight - top - SCREEN_PADDING),
    };
  }, [anchorRect, windowHeight, windowWidth]);

  return (
    <Wrapper compact={compact}>
      <TriggerWrapper ref={triggerRef} collapsable={false}>
        <Button
          active={hasActiveSelection}
          onPress={() => {
            if (!isOpen) {
              measureTrigger();
            }
            setIsOpen((current) => !current);
          }}
          accessibilityLabel="Tag filters"
          Icon={compact ? TriggerIcon : undefined}
          text={compact ? undefined : activeCount > 0 ? `Tags (${activeCount})` : 'Tags'}
          hitSlop={compact ? compactTriggerHitSlop : undefined}
          padding={compact ? 'small' : 'medium'}
          style={compact ? compactTriggerStyle : undefined}
          variant={compact ? 'ghost' : hasActiveSelection ? 'ghost' : 'outline'}
        >
          {compact && activeCount > 0 ? <SelectedDot /> : null}
        </Button>
      </TriggerWrapper>

      {isOpen && popoverStyle ? (
        <Portal hostName="storybook-lite-ui-root">
          <PopoverContainer pointerEvents="box-none">
            <Backdrop onPress={() => setIsOpen(false)} />
            <Panel style={popoverStyle}>
              <PanelHeader>
                <PanelTitle>Filter stories by tag</PanelTitle>
                <HeaderActions>
                  <Button
                    onPress={clearSelection}
                    text="Clear"
                    variant="ghost"
                    disabled={!hasActiveSelection}
                    style={{ opacity: hasActiveSelection ? 1 : 0 }}
                  />
                </HeaderActions>
              </PanelHeader>

              {filters.length === 0 ? (
                <EmptyText>Add tags to your stories to filter them here.</EmptyText>
              ) : (
                <FiltersScrollView
                  keyboardShouldPersistTaps="handled"
                  style={filtersScrollViewStyle}
                  contentContainerStyle={filtersScrollContentStyle}
                >
                  {filters.map((filter) => {
                    const isIncluded = selection.included.has(filter.id);
                    const isExcluded = selection.excluded.has(filter.id);
                    const isChecked = isIncluded || isExcluded;

                    return (
                      <FilterRow key={filter.id}>
                        <FilterToggle
                          onPress={() => updateSelection(filter.id)}
                          accessibilityRole="checkbox"
                          accessibilityState={{ checked: isChecked }}
                        >
                          <Checkbox checked={isChecked}>
                            {isChecked ? (
                              <Checkmark checked={isIncluded}>{isExcluded ? '−' : '✓'}</Checkmark>
                            ) : null}
                          </Checkbox>
                          <FilterMeta>
                            <FilterTitleRow>
                              <FilterTitle>{filter.title}</FilterTitle>
                              {isExcluded ? <ExcludedLabel>(excluded)</ExcludedLabel> : null}
                            </FilterTitleRow>
                            {isExcluded ? (
                              <ExcludedCount>{filter.count} matches</ExcludedCount>
                            ) : (
                              <FilterCount>{filter.count} matches</FilterCount>
                            )}
                          </FilterMeta>
                        </FilterToggle>
                        <RowActions>
                          <Button
                            onPress={() => toggleExcluded(filter.id)}
                            text={isExcluded ? 'Include' : 'Exclude'}
                            variant="ghost"
                          />
                        </RowActions>
                      </FilterRow>
                    );
                  })}
                </FiltersScrollView>
              )}
            </Panel>
          </PopoverContainer>
        </Portal>
      ) : null}
    </Wrapper>
  );
});
