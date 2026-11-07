import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { styled } from '@storybook/react-native-theming';

const DefaultText = styled.Text(({ theme }) => ({
  color: theme.color.defaultText,
}));

const ObjectNameText = styled.Text(({ theme }) => ({
  color: theme.color.secondary,
}));

const MutedText = styled.Text(({ theme }) => ({
  color: theme.textMutedColor,
}));

const StringText = styled.Text(({ theme }) => ({
  color: theme.color.orange,
}));

const NumberText = styled.Text(({ theme }) => ({
  color: theme.color.green,
}));

const BooleanText = styled.Text(({ theme }) => ({
  color: theme.color.seafoam,
}));

const FunctionText = styled.Text(({ theme }) => ({
  color: theme.color.purple,
}));

const ArrowText = styled.Text<{ visible: boolean }>(({ theme, visible }) => ({
  color: visible ? theme.textMutedColor : 'transparent',
  paddingRight: 8,
}));

interface InspectProps {
  name?: string;
  value: any;
}

const Inspect = ({ name, value }: InspectProps) => {
  const [expanded, setExpanded] = useState(false);
  const canExpand =
    name &&
    ((Array.isArray(value) && value.length) ||
      (value && typeof value === 'object' && Object.keys(value).length));
  const toggleExpanded = React.useCallback(() => {
    if (canExpand) {
      setExpanded((currentValue) => !currentValue);
    }
  }, [canExpand]);

  const toggle = <ArrowText visible={!!canExpand}>{expanded ? '▼' : '▶'}</ArrowText>;

  const nameComponent = name ? <ObjectNameText>{name}</ObjectNameText> : null;

  if (Array.isArray(value)) {
    if (name) {
      return (
        <>
          <TouchableOpacity onPress={toggleExpanded} style={styles.row}>
            {toggle}
            {nameComponent}
            <DefaultText>{`: ${value.length === 0 ? '[]' : expanded ? '[' : '[...]'}`}</DefaultText>
          </TouchableOpacity>
          {expanded ? (
            <View style={styles.expanded}>
              {value.map((v, i) => (
                <View key={i} style={styles.expanded}>
                  <Inspect value={v} />
                </View>
              ))}
              <View style={styles.spacingLeft}>
                <DefaultText>]</DefaultText>
              </View>
            </View>
          ) : null}
        </>
      );
    }
    return (
      <>
        <DefaultText>[</DefaultText>
        {value.map((v, i) => (
          <View key={i} style={styles.spacingLeft}>
            <Inspect value={v} />
          </View>
        ))}
        <DefaultText>]</DefaultText>
      </>
    );
  }
  if (value && typeof value === 'object' && !(value instanceof RegExp)) {
    if (name) {
      return (
        <>
          <TouchableOpacity style={styles.row} onPress={toggleExpanded}>
            {toggle}
            {nameComponent}
            <DefaultText>{`: ${Object.keys(value).length === 0 ? '{}' : expanded ? '{' : '{...}'}`}</DefaultText>
          </TouchableOpacity>
          {expanded ? (
            <View style={styles.expanded}>
              {Object.entries(value).map(([key, v]) => (
                <View key={key}>
                  <Inspect name={key} value={v} />
                </View>
              ))}
              <View style={styles.spacingLeft}>
                <DefaultText>{'}'}</DefaultText>
              </View>
            </View>
          ) : null}
        </>
      );
    }
    return (
      <>
        <DefaultText>{'{'}</DefaultText>
        {Object.entries(value).map(([key, v]) => (
          <View key={key}>
            <Inspect name={key} value={v} />
          </View>
        ))}
        <DefaultText>{'}'}</DefaultText>
      </>
    );
  }
  if (name) {
    return (
      <View style={styles.row}>
        {toggle}
        {nameComponent}
        <DefaultText>: </DefaultText>
        <Value value={value} />
      </View>
    );
  }
  return <Value value={value} />;
};

function Value({ value }: { value: any }) {
  if (value === null) {
    return <MutedText>null</MutedText>;
  }
  if (value === undefined) {
    return <MutedText>undefined</MutedText>;
  }
  if (value instanceof RegExp) {
    return <StringText>{`/${value.source}/${value.flags}`}</StringText>;
  }
  switch (typeof value) {
    case 'string':
      return <StringText>{JSON.stringify(value)}</StringText>;
    case 'number':
      return <NumberText>{JSON.stringify(value)}</NumberText>;
    case 'boolean':
      return <BooleanText>{JSON.stringify(value)}</BooleanText>;
    case 'function':
      return <FunctionText>[Function]</FunctionText>;
    default:
      return <DefaultText>{JSON.stringify(value)}</DefaultText>;
  }
}

export default Inspect;

const styles = StyleSheet.create({
  spacingLeft: { marginLeft: 20 },
  expanded: { marginLeft: 20 },
  row: { paddingBottom: 8, flexDirection: 'row', alignItems: 'center' },
});
