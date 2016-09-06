import React from 'react';
import AceEditor from 'react-ace';
import 'brace/mode/javascript';
import 'brace/theme/github';

const styles = {
  border: '1px solid #ececec',
  padding: '5px',
};

class StringType extends React.Component {
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

StringType.propTypes = {
  value: React.PropTypes.string,
  name: React.PropTypes.string,
  onChange: React.PropTypes.func,
};

export default StringType;
