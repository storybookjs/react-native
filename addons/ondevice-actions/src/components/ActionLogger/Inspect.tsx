import React from 'react';
import { Button, View, Text } from 'react-native';

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

class Inspect extends React.Component<{ name?: string; value: any }, { expanded: boolean }> {
  state = { expanded: false };
  render() {
    const { name, value } = this.props;
    const { expanded } = this.state;
    const toggle = (
      <View style={{ width: 40, height: 40 }}>
        {name &&
        ((Array.isArray(value) && value.length) ||
          (value &&
            typeof value === 'object' &&
            !Array.isArray(value) &&
            Object.keys(value).length)) ? (
          <Button
            onPress={() => this.setState(s => ({ expanded: !s.expanded }))}
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
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {toggle}
              {nameComponent}
              <Text>{': ' + (value.length === 0 ? '[]' : expanded ? '[' : '[...]')}</Text>
            </View>
            {expanded ? (
              <View style={{ marginLeft: 40 }}>
                {value.map((v, i) => (
                  <View key={i} style={{ marginLeft: 40 }}>
                    <Inspect value={v} />
                  </View>
                ))}
                <View style={{ marginLeft: 20 }}>
                  <Text>{']'}</Text>
                </View>
              </View>
            ) : null}
          </>
        );
      }
      return (
        <View>
          <Text>{'['}</Text>
          {value.map((v, i) => (
            <View key={i} style={{ marginLeft: 20 }}>
              <Inspect value={v} />
            </View>
          ))}
          <Text>{']'}</Text>
        </View>
      );
    }
    if (value && typeof value === 'object' && !(value instanceof RegExp)) {
      if (name) {
        return (
          <>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {toggle}
              {nameComponent}
              <Text>
                {': ' + (Object.keys(value).length === 0 ? '{}' : expanded ? '{' : '{...}')}
              </Text>
            </View>
            {expanded ? (
              <View style={{ marginLeft: 40 }}>
                {Object.entries(value).map(([key, v]) => (
                  <View key={key}>
                    <Inspect name={key} value={v} />
                  </View>
                ))}
                <View style={{ marginLeft: 20 }}>
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
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {toggle}
          {nameComponent}
          <Text>{': '}</Text>
          <Value value={value} />
        </View>
      );
    }
    return (
      <View>
        <Value value={value} />
      </View>
    );
  }
}

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
        {'/' + value.source + '/' + value.flags}
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
  }
  return <Text>{JSON.stringify(value)}</Text>;
}

export default Inspect;
