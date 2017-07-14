import PropTypes from 'prop-types';
import React from 'react';
import CommentList from '../CommentList';
import CommentForm from '../CommentForm';
import style from './style';

export default function CommentsPanel(props) {
  if (props.loading) {
    return (
      <div style={style.wrapper}>
        <div style={style.message}>loading...</div>
      </div>
    );
  }

  if (props.appNotAvailable) {
    const appsUrl = 'https://hub.getstorybook.io/apps';
    return (
      <div style={style.wrapper}>
        <div style={style.message}>
          <a style={style.button} href={appsUrl}>
            Create an app for this repo on Storybook Hub
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={style.wrapper}>
      <CommentList key="list" {...props} />
      <CommentForm key="form" {...props} />
    </div>
  );
}

CommentsPanel.defaultProps = {
  loading: false,
  appNotAvailable: false,
};

CommentsPanel.propTypes = {
  loading: PropTypes.bool,
  appNotAvailable: PropTypes.bool,
};
