import { FileReader } from 'global';
import PropTypes, { Validator } from 'prop-types';
import React, { ChangeEvent, FunctionComponent } from 'react';
import { styled } from '@storybook/theming';

import { Form } from '@storybook/components';
import { KnobControlConfig, KnobControlProps } from './types';

type DateTypeKnobValue = string[];

export interface FileTypeKnob extends KnobControlConfig<DateTypeKnobValue> {
  accept: string;
}

export interface FilesTypeProps extends KnobControlProps<DateTypeKnobValue> {
  knob: FileTypeKnob;
}

const FileInput = styled(Form.Input)({
  paddingTop: 4,
});

function fileReaderPromise(file: File) {
  return new Promise<string>(resolve => {
    const fileReader = new FileReader();
    fileReader.onload = (e: Event) => resolve((e.currentTarget as FileReader).result as string);
    fileReader.readAsDataURL(file);
  });
}

const serialize = (): undefined => undefined;
const deserialize = (): undefined => undefined;

const FilesType: FunctionComponent<FilesTypeProps> & {
  serialize: typeof serialize;
  deserialize: typeof deserialize;
} = ({ knob, onChange }) => (
  <FileInput
    type="file"
    name={knob.name}
    multiple
    onChange={(e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        Promise.all(Array.from(e.target.files).map(fileReaderPromise)).then(onChange);
      }
    }}
    accept={knob.accept}
    size="flex"
  />
);

FilesType.defaultProps = {
  knob: {} as any,
  onChange: value => value,
};

FilesType.propTypes = {
  knob: PropTypes.shape({
    name: PropTypes.string,
  }) as Validator<FilesTypeProps['knob']>,
  onChange: PropTypes.func as Validator<FilesTypeProps['onChange']>,
};

FilesType.serialize = serialize;
FilesType.deserialize = deserialize;

export default FilesType;
