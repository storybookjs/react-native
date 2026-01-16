import { FC, useRef, useState } from 'react';
import { View, StyleSheet, Pressable, TextInput } from 'react-native';
import { SearchIcon, CloseIcon } from '../icons';
import { colors } from '../theme/colors';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

export const SearchBar: FC<SearchBarProps> = ({ value, onChange, onClear }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [clearHovered, setClearHovered] = useState(false);
  const inputRef = useRef<TextInput>(null);

  return (
    <Pressable
      onPress={() => inputRef.current?.focus()}
      style={[styles.searchContainer, isFocused && styles.searchContainerFocused]}
    >
      <View style={styles.searchIconWrapper}>
        <SearchIcon color={isFocused ? colors.secondary : colors.mediumdark} />
      </View>
      <TextInput
        ref={inputRef}
        style={[styles.searchInput, { outlineStyle: 'none' } as any]}
        value={value}
        onChangeText={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Search stories..."
        placeholderTextColor={colors.textMutedColor}
      />
      {value.length > 0 && (
        <Pressable
          onHoverIn={() => setClearHovered(true)}
          onHoverOut={() => setClearHovered(false)}
          style={[styles.clearButton, clearHovered && styles.clearButtonHover]}
          onPress={onClear}
        >
          <CloseIcon color={colors.textMutedColor} />
        </Pressable>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.appContentBg,
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  } as any,
  searchContainerFocused: {
    borderColor: colors.secondary,
    boxShadow: `0 0 0 1px ${colors.secondary}`,
  } as any,
  searchIconWrapper: {
    paddingLeft: 10,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 8,
    color: colors.textColor,
    fontSize: 13,
  },
  clearButton: {
    padding: 8,
    borderRadius: 4,
    marginRight: 2,
  },
  clearButtonHover: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
});
