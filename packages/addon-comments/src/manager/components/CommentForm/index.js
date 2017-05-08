import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { window } from 'global';
import Textarea from 'react-textarea-autosize';
import marked from 'marked';
import style from './style';

const renderer = new marked.Renderer();
renderer.heading = text => text;

marked.setOptions({
  renderer,
  gfm: true,
  tables: false,
  breaks: true,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false,
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

  onSubmit() {
    const { addComment } = this.props;
    const text = this.state.text.trim();
    if (!text || text === '') {
      return;
    }

    addComment(marked(text));
    this.setState({ text: '' });
  }

  openLogin() {
    const signInUrl = `https://hub.getstorybook.io/sign-in?redirectUrl=${encodeURIComponent(window.location.href)}`;
    window.location.href = signInUrl;
  }

  handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.onSubmit();
    }
  }

  render() {
    if (!this.props.user) {
      return (
        <div style={style.wrapper}>
          <Textarea style={style.input} disabled />
          <button style={style.submitButton} onClick={() => this.openLogin()}>
            Sign in with Storybook Hub
          </button>
        </div>
      );
    }

    const { text } = this.state;
    return (
      <div style={style.wrapper}>
        <Textarea
          style={style.input}
          onChange={e => this.onChange(e)}
          onKeyDown={e => this.handleKeyDown(e)}
          placeholder="Add your comment..."
          value={text}
        />
        <button style={style.submitButton} onClick={() => this.onSubmit()}>
          Submit
        </button>
      </div>
    );
  }
}

CommentForm.defaultProps = {
  user: null,
  addComment: () => {},
};
CommentForm.propTypes = {
  user: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  addComment: PropTypes.func,
};
