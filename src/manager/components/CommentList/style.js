const commentItem = {
  display: 'flex',
  paddingBottom: '5px',
  WebkitFontSmoothing: 'antialiased',
  transition: 'opacity 0.5s',
  maxWidth: 700,
}

export default {
  wrapper: {
    flex: 1,
    overflow: 'auto',
    padding: '7px 15px',
  },
  commentItem: {
    ...commentItem,
  },
  commentItemloading: {
    ...commentItem,
    opacity: 0.25,
  },
  commentAside: {
    margin: '5px 10px 0 0',
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 5,
  },
  commentContent: {
    flex: 1,
  },
  commentHead: {
    //
  },
  commentUser: {
    fontFamily: 'sans-serif',
    fontSize: 13,
    lineHeight: 1,
    fontWeight: 'bold',
    marginRight: 5,
  },
  commentTime: {
    fontFamily: 'sans-serif',
    fontSize: 11,
    lineHeight: 1,
    color: 'rgb(150, 150, 150)',
  },
  commentText: {
    fontFamily: 'sans-serif',
    fontSize: 13,
    lineHeight: 1.7,
    maxWidth: 650,
  },
  noComments: {
    fontFamily: 'sans-serif',
    fontSize: 13,
    padding: '10px 0',
  }
}
