import React from 'react';
import AceEditor from 'react-ace';
import { js_beautify as beautify } from 'js-beautify';
import tosource from 'tosource';
import 'brace/mode/javascript';
import 'brace/theme/github';

const styles = {
  border: '1px solid #ececec',
  padding: '5px',
};

class ObjectType extends React.Component {
  handleChange(sourceText) {
    const { onChange } = this.props;
    try {
      const value = JSON.parse(sourceText.trim());
      onChange(value);
    } catch(e) {}
  }

  render() {
    const { knob } = this.props;
    const value = JSON.stringify(knob.value, null, 2);

    return (
      <div style={styles}>
        <AceEditor
          mode="javascript"
          theme="github"
          value={value}
          onChange={e => this.handleChange(e)}
          name={knob.name}
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
  knob: React.PropTypes.object,
  onChange: React.PropTypes.func,
};

ObjectType.serialize = function(object) {
  return JSON.stringify(object);
};

ObjectType.deserialize = function(value) {
  if (!value) return {};
  return JSON.parse(value);
};

export default ObjectType;
