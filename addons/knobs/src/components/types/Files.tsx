import { FileReader } from 'global';
import PropTypes from 'prop-types';
import React, { ChangeEvent, FunctionComponent } from 'react';
import { styled } from '@storybook/theming';

import { Form } from '@storybook/components';

type DateTypeKnobValue = string[];

export interface FileTypeKnob {
  name: string;
  accept: string;
  value: DateTypeKnobValue;
}

export interface FilesTypeProps {
  knob: FileTypeKnob;
  onChange: (value: DateTypeKnobValue) => DateTypeKnobValue;
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
    onChange={(e: ChangeEvent<HTMLInputElement>) =>
      Promise.all(Array.from(e.target.files).map(fileReaderPromise)).then(onChange)
    }
    accept={knob.accept}
    size="flex"
  />
);

FilesType.defaultProps = {
  knob: {} as any,
  onChange: value => value,
};

FilesType.propTypes = {
  // TODO: remove `any` once DefinitelyTyped/DefinitelyTyped#31280 has been resolved
  knob: PropTypes.shape({
    name: PropTypes.string,
  }) as any,
  onChange: PropTypes.func,
};

FilesType.serialize = serialize;
FilesType.deserialize = deserialize;

export default FilesType;
