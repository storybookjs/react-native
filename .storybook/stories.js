import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import CommentForm from '../src/manager/components/CommentForm';
import CommentList from '../src/manager/components/CommentList';
import CommentsPanel from '../src/manager/components/CommentsPanel';

const commentsList = [
  {
    loading: false,
    user: {
      avatar: 'http://www.gravatar.com/avatar/?d=identicon',
      name: 'User A'
    },
    time: 'Wed Oct 12 2016 13:36:59 GMT+0530 (IST)',
    text: 'Lorem ipsum dolor sit amet, <pre><code>Ut odio massa, rutrum et purus id.</code></pre>'
  },
  {
    loading: false,
    user: {
      avatar: 'http://www.gravatar.com/avatar/?d=identicon',
      name: 'User B'
    },
    time: 'Wed Oct 12 2016 13:38:46 GMT+0530 (IST)',
    text: 'Vivamus tortor nisi, <b>efficitur</b> in rutrum <em>ac</em>, tempor <code>et mauris</code>. In et rutrum enim'
  },
  {
    loading: true,
    user: {
      avatar: 'http://www.gravatar.com/avatar/?d=identicon',
      name: 'User C'
    },
    time: 'Wed Oct 12 2016 13:38:55 GMT+0530 (IST)',
    text: 'sample comment 3'
  }
];

storiesOf('Button', module)
  .add('Hello World', () => (
    <button>"Hello World"</button>
  ))
  .add('Hello Earth', () => (
    <button>"Hello Earth"</button>
  ));

storiesOf('Components', module)
  .add('CommentForm', () => (
    <CommentForm
      addComment={ action('addComment') }
    />
  ))
  .add('CommentList - No Comments', () => (
    <CommentList
      comments={[]}
    />
  ))
  .add('CommentList - with comments', () => (
    <CommentList
      comments={commentsList}
    />
  ))
  .add('CommentPanel - not loggedIn', () => (
    <CommentsPanel />
  ))
  .add('CommentPanel - app not available', () => (
    <CommentsPanel
      user={true}
      appNotAvailable={{}}
    />
  ))
  .add('CommentPanel - loggedIn with no comments', () => (
    <CommentsPanel
      user={true}
      loading={false}
      comments={[]}
      addComment={ action('addComment') }
    />
  ))
  .add('CommentPanel - loggedIn with has comments', () => (
    <CommentsPanel
      user={true}
      loading={false}
      comments={commentsList}
      addComment={ action('addComment') }
    />
  ));
