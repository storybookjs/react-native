import React, { Component } from 'react';
import Textarea from 'react-textarea-autosize';
import marked from 'marked';
import style from './style';

const renderer = new marked.Renderer();
renderer.heading = function (text, level) {
  return text;
}

marked.setOptions({
  renderer: renderer,
  gfm: true,
  tables: false,
  breaks: true,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
});

export default class CommentForm extends Component {
  constructor(props, ...args) {
    super(props, ...args);
    this.state = { text: '' };
  }

  onChange(e) {
    const text = e.target.value;
    this.setState({ text });
  }

  handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.onSubmit();
    }
  }

  onSubmit() {
    const { addComment } = this.props;
    const text = this.state.text.trim();
    if (!text || text === '') {
      return;
    }

    addComment(marked(text));
    this.setState({ text: '' });
  }

  render() {
    const { text } = this.state;
    return (
      <div style={style.wrapper}>
        <Textarea
          ref="commentBox"
          style={style.input}
          onChange={e => this.onChange(e)}
          onKeyDown={e => this.handleKeyDown(e)}
          placeholder="Add your comment..."
          value={text}
        >
        </Textarea>
        <button
          ref="submitBtn"
          style={style.submitButton}
          onClick={() => this.onSubmit()}
        >Submit
        </button>
      </div>
    );
  }
}
