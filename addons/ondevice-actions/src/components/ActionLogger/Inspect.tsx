import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const theme = {
  OBJECT_NAME_COLOR: 'rgb(136, 19, 145)',
  OBJECT_VALUE_NULL_COLOR: 'rgb(128, 128, 128)',
  OBJECT_VALUE_UNDEFINED_COLOR: 'rgb(128, 128, 128)',
  OBJECT_VALUE_REGEXP_COLOR: 'rgb(196, 26, 22)',
  OBJECT_VALUE_STRING_COLOR: 'rgb(196, 26, 22)',
  OBJECT_VALUE_SYMBOL_COLOR: 'rgb(196, 26, 22)',
  OBJECT_VALUE_NUMBER_COLOR: 'rgb(28, 0, 207)',
  OBJECT_VALUE_BOOLEAN_COLOR: 'rgb(28, 0, 207)',
  OBJECT_VALUE_FUNCTION_PREFIX_COLOR: 'rgb(13, 34, 170)',

  ARROW_COLOR: '#859499',
};

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

  const toggle = (
    <Text style={{ color: canExpand ? theme.ARROW_COLOR : 'transparent', paddingRight: 8 }}>
      {expanded ? '▼' : '▶'}
    </Text>
  );

  const nameComponent = name ? (
    <Text style={{ color: theme.OBJECT_NAME_COLOR }}>{name}</Text>
  ) : null;

  if (Array.isArray(value)) {
    if (name) {
      return (
        <>
          <TouchableOpacity onPress={toggleExpanded} style={styles.row}>
            {toggle}
            {nameComponent}
            <Text>{`: ${value.length === 0 ? '[]' : expanded ? '[' : '[...]'}`}</Text>
          </TouchableOpacity>
          {expanded ? (
            <View style={styles.expanded}>
              {value.map((v, i) => (
                <View key={i} style={styles.expanded}>
                  <Inspect value={v} />
                </View>
              ))}
              <View style={styles.spacingLeft}>
                <Text>]</Text>
              </View>
            </View>
          ) : null}
        </>
      );
    }
    return (
      <>
        <Text>[</Text>
        {value.map((v, i) => (
          <View key={i} style={styles.spacingLeft}>
            <Inspect value={v} />
          </View>
        ))}
        <Text>]</Text>
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
            <Text>{`: ${Object.keys(value).length === 0 ? '{}' : expanded ? '{' : '{...}'}`}</Text>
          </TouchableOpacity>
          {expanded ? (
            <View style={styles.expanded}>
              {Object.entries(value).map(([key, v]) => (
                <View key={key}>
                  <Inspect name={key} value={v} />
                </View>
              ))}
              <View style={styles.spacingLeft}>
                <Text>{'}'}</Text>
              </View>
            </View>
          ) : null}
        </>
      );
    }
    return (
      <>
        <Text>{'{'}</Text>
        {Object.entries(value).map(([key, v]) => (
          <View key={key}>
            <Inspect name={key} value={v} />
          </View>
        ))}
        <Text>{'}'}</Text>
      </>
    );
  }
  if (name) {
    return (
      <View style={styles.row}>
        {toggle}
        {nameComponent}
        <Text>: </Text>
        <Value value={value} />
      </View>
    );
  }
  return <Value value={value} />;
};

function Value({ value }: { value: any }) {
  if (value === null) {
    return <Text style={{ color: theme.OBJECT_VALUE_NULL_COLOR }}>null</Text>;
  }
  if (value === undefined) {
    return <Text style={{ color: theme.OBJECT_VALUE_UNDEFINED_COLOR }}>undefined</Text>;
  }
  if (value instanceof RegExp) {
    return (
      <Text style={{ color: theme.OBJECT_VALUE_REGEXP_COLOR }}>
        {`/${value.source}/${value.flags}`}
      </Text>
    );
  }
  switch (typeof value) {
    case 'string':
      return (
        <Text style={{ color: theme.OBJECT_VALUE_STRING_COLOR }}>{JSON.stringify(value)}</Text>
      );
    case 'number':
      return (
        <Text style={{ color: theme.OBJECT_VALUE_NUMBER_COLOR }}>{JSON.stringify(value)}</Text>
      );
    case 'boolean':
      return (
        <Text style={{ color: theme.OBJECT_VALUE_BOOLEAN_COLOR }}>{JSON.stringify(value)}</Text>
      );
    case 'function':
      return <Text style={{ color: theme.OBJECT_VALUE_FUNCTION_PREFIX_COLOR }}>[Function]</Text>;
    default:
      return <Text>{JSON.stringify(value)}</Text>;
  }
}

export default Inspect;

const styles = StyleSheet.create({
  spacingLeft: { marginLeft: 20 },
  expanded: { marginLeft: 20 },
  row: { paddingBottom: 8, flexDirection: 'row', alignItems: 'center' },
});
