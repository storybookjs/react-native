import React, { useState } from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';

const theme = {
  OBJECT_PREVIEW_ARRAY_MAX_PROPERTIES: 10,
  OBJECT_PREVIEW_OBJECT_MAX_PROPERTIES: 5,
  OBJECT_NAME_COLOR: 'rgb(136, 19, 145)',
  OBJECT_VALUE_NULL_COLOR: 'rgb(128, 128, 128)',
  OBJECT_VALUE_UNDEFINED_COLOR: 'rgb(128, 128, 128)',
  OBJECT_VALUE_REGEXP_COLOR: 'rgb(196, 26, 22)',
  OBJECT_VALUE_STRING_COLOR: 'rgb(196, 26, 22)',
  OBJECT_VALUE_SYMBOL_COLOR: 'rgb(196, 26, 22)',
  OBJECT_VALUE_NUMBER_COLOR: 'rgb(28, 0, 207)',
  OBJECT_VALUE_BOOLEAN_COLOR: 'rgb(28, 0, 207)',
  OBJECT_VALUE_FUNCTION_PREFIX_COLOR: 'rgb(13, 34, 170)',

  ARROW_COLOR: '#6e6e6e',
  ARROW_MARGIN_RIGHT: 3,
  ARROW_FONT_SIZE: 12,
  ARROW_ANIMATION_DURATION: '0',
};

interface InspectProps {
  name?: string;
  value: any;
}

const Inspect = ({ name, value }: InspectProps) => {
  const [expanded, setExpanded] = useState(false);
  const toggle = (
    <View style={styles.container}>
      {name &&
      ((Array.isArray(value) && value.length) ||
        (value &&
          typeof value === 'object' &&
          !Array.isArray(value) &&
          Object.keys(value).length)) ? (
        <Button
          onPress={() => setExpanded((wasExpanded) => !wasExpanded)}
          title={!expanded ? '▶' : '▼'}
        />
      ) : null}
    </View>
  );

  const nameComponent = name ? (
    <Text style={{ color: theme.OBJECT_NAME_COLOR }}>{name}</Text>
  ) : null;

  if (Array.isArray(value)) {
    if (name) {
      return (
        <>
          <View style={styles.row}>
            {toggle}
            {nameComponent}
            <Text>{`: ${value.length === 0 ? '[]' : expanded ? '[' : '[...]'}`}</Text>
          </View>
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
      <View>
        <Text>[</Text>
        {value.map((v, i) => (
          <View key={i} style={styles.spacingLeft}>
            <Inspect value={v} />
          </View>
        ))}
        <Text>]</Text>
      </View>
    );
  }
  if (value && typeof value === 'object' && !(value instanceof RegExp)) {
    if (name) {
      return (
        <>
          <View style={styles.row}>
            {toggle}
            {nameComponent}
            <Text>{`: ${Object.keys(value).length === 0 ? '{}' : expanded ? '{' : '{...}'}`}</Text>
          </View>
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
      <View>
        <Text>{'{'}</Text>
        {Object.entries(value).map(([key, v]) => (
          <View key={key}>
            <Inspect name={key} value={v} />
          </View>
        ))}
        <Text>{'}'}</Text>
      </View>
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
  return (
    <View>
      <Value value={value} />
    </View>
  );
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
  expanded: { marginLeft: 40 },
  row: { flexDirection: 'row', alignItems: 'center' },
  container: { width: 40, height: 40 },
});
