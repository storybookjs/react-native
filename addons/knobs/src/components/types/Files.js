import { FileReader } from 'global';
import PropTypes from 'prop-types';
import React from 'react';
import { styled } from '@storybook/theming';

import { Form } from '@storybook/components';

const FileInput = styled(Form.Input)({
  paddingTop: 4,
});

function fileReaderPromise(file) {
  return new Promise(resolve => {
    const fileReader = new FileReader();
    fileReader.onload = e => resolve(e.currentTarget.result);
    fileReader.readAsDataURL(file);
  });
}

const FilesType = ({ knob, onChange }) => (
  <FileInput
    type="file"
    name={knob.name}
    multiple
    onChange={e => Promise.all(Array.from(e.target.files).map(fileReaderPromise)).then(onChange)}
    accept={knob.accept}
    size="flex"
  />
);

FilesType.defaultProps = {
  knob: {},
  onChange: value => value,
};

FilesType.propTypes = {
  knob: PropTypes.shape({
    name: PropTypes.string,
  }),
  onChange: PropTypes.func,
};

FilesType.serialize = () => undefined;
FilesType.deserialize = () => undefined;

export default FilesType;
