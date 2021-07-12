import React, { useCallback, useState } from 'react';
import styled from '@emotion/native';
import { ViewStyle } from 'react-native';

export interface ObjectProps {
  arg: {
    name: string;
    value: Record<string, any> | Array<any>;
  };
  onChange: (value: any) => void;
}

const Input = styled.TextInput(({ theme }) => ({
  borderWidth: 1,
  borderRadius: 2,
  fontSize: 13,
  padding: 5,
  margin: 10,
  borderColor: theme.borderColor || '#e6e6e6',
  color: theme.labelColor || 'black',
}));

const ObjectType = ({ arg, onChange }: ObjectProps) => {
  const getJsonString = useCallback(() => {
    try {
      return JSON.stringify(arg.value, null, 2);
    } catch (error) {
      return '';
    }
  }, [arg.value]);

  const [failed, setFailed] = useState(false);

  const handleChange = (value) => {
    const withReplacedQuotes = value
      // eslint-disable-next-line quotes
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"');

    try {
      const json = JSON.parse(withReplacedQuotes.trim());

      onChange(json);
      setFailed(false);
    } catch (err) {
      setFailed(true);
    }
  };

  const extraStyle: ViewStyle = {};

  if (failed) {
    extraStyle.borderWidth = 1;
    extraStyle.borderColor = '#fadddd';
    extraStyle.backgroundColor = '#fff5f5';
  }

  return (
    <Input
      testID={arg.name}
      style={extraStyle}
      defaultValue={getJsonString()}
      onChangeText={handleChange}
      multiline
      autoCapitalize="none"
      underlineColorAndroid="transparent"
    />
  );
};

ObjectType.serialize = (object) => JSON.stringify(object);

ObjectType.deserialize = (value) => (value ? JSON.parse(value) : {});

export default ObjectType;
