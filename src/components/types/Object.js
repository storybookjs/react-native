import React from 'react';
import AceEditor from 'react-ace';
import 'brace/mode/javascript';
import 'brace/theme/github';

const styles = {
  border: '1px solid #ececec',
  padding: '5px',
};

class ObjectType extends React.Component {
  render() {
    const { value, name, onChange } = this.props;

    return (
      <div style={styles}>
        <AceEditor
          mode="javascript"
          theme="github"
          value={value}
          onChange={onChange}
          name={name}
          width="100%"
          height="120px"
          editorProps={{ $blockScrolling: true }}
          setOptions={{ showLineNumbers: false }}
          showPrintMargin={false}
          showGutter={false}
          highlightActiveLine={false}
        />
      </div>
    );
  }
}

ObjectType.propTypes = {
  value: React.PropTypes.string,
  name: React.PropTypes.string,
  onChange: React.PropTypes.func,
};

ObjectType.serialize = function(object) {
  return JSON.stringify(object);
};

ObjectType.deserialize = function(value) {
  return JSON.parse(value);
};

export default ObjectType;
