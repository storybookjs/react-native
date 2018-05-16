import { FileReader } from 'global';
import PropTypes from 'prop-types';
import React from 'react';

import styled from 'react-emotion';

const Input = styled('input')({
  display: 'table-cell',
  boxSizing: 'border-box',
  verticalAlign: 'middle',
  height: '26px',
  width: '100%',
  maxWidth: '100%',
  outline: 'none',
  border: '1px solid #f7f4f4',
  borderRadius: 2,
  fontSize: 11,
  padding: '5px',
  color: '#555',
});

function fileReaderPromise(file) {
  return new Promise(resolve => {
    const fileReader = new FileReader();
    fileReader.onload = e => resolve(e.currentTarget.result);
    fileReader.readAsDataURL(file);
  });
}

const FilesType = ({ knob, onChange }) => (
  <Input
    id={knob.name}
    type="file"
    multiple
    onChange={e => Promise.all(Array.from(e.target.files).map(fileReaderPromise)).then(onChange)}
    accept={knob.accept}
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
