import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';

const Button = styled('button')(
  {
    overflow: 'hidden',
    border: '1px solid #eee',
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    cursor: 'pointer',
    fontSize: 13,
    padding: '3px 10px',
    alignSelf: 'flex-start',
    flexShrink: 0,

    ':hover': {
      backgroundColor: '#f4f7fa',
      borderColor: '#ddd',
    },

    ':active': {
      backgroundColor: '#e9ecef',
      borderColor: '#ccc',
    },
  },
  ({ styles }) => styles
);

const ContentWrapper = styled('div')(
  {
    transition: 'transform .2s ease',
    height: 16,
  },
  ({ styles, toggled }) => ({
    ...styles,
    transform: toggled ? 'translateY(0px)' : 'translateY(-100%) translateY(-6px)',
  })
);

function CopyButton({ theme, onClick, toggled }) {
  const { copyButton = {}, copyButtonContent } = theme;
  const { toggleText = 'Copied!', text = 'Copy', ...copyButtonStyles } = copyButton;

  return (
    <Button onClick={onClick} styles={copyButtonStyles}>
      <ContentWrapper styles={copyButtonContent} toggled={toggled}>
        <div style={{ marginBottom: 6 }}>{toggleText}</div>
        <div>{text}</div>
      </ContentWrapper>
    </Button>
  );
}

CopyButton.propTypes = {
  onClick: PropTypes.func,
  toggled: PropTypes.bool,
  theme: PropTypes.shape({
    copyButton: PropTypes.object,
  }),
};

CopyButton.defaultProps = {
  onClick: () => {},
  toggled: false,
  theme: {},
};

export default CopyButton;
