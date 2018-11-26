import { document, DOMParser } from 'global';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { monoFonts } from '@storybook/components';
import styled from '@emotion/styled';

import css from 'react-syntax-highlighter/dist/esm/languages/prism/css';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/prism-light';

SyntaxHighlighter.registerLanguage('css', css);

const storybookIframe = 'storybook-preview-iframe';
const addedElAttr = 'addedbycssresourcesaddon';

// Taken from StoryPanel.js
const highlighterTheme = {
  ...darcula,
  'pre[class*="language-"]': {
    ...darcula['pre[class*="language-"]'],
    margin: 'auto',
    width: 'auto',
    height: 'auto',
    minHeight: '100%',
    overflow: 'hidden',
    boxSizing: 'border-box',
    display: 'flex',
    fontFamily: monoFonts.fontFamily,
    fontSize: 'inherit',
  },
  'code[class*="language-"]': {
    ...darcula['code[class*="language-"]'],
    margin: 0,
    fontFamily: 'inherit',
  },
};

const PanelWrapper = styled.div({
  position: 'absolute',
  top: '10px',
  left: '10px',
  fontFamily: monoFonts.fontFamily,
});

export default class CssResourcePanel extends Component {
  constructor(props) {
    super(props);
    this.state = { cssresources: `` };
    this.onAddCssresources = this.onAddCssresources.bind(this);
    this.parser = new DOMParser();
  }

  componentDidMount() {
    const { channel } = this.props;
    this.iframe = document.getElementById(storybookIframe);
    if (!this.iframe) {
      throw new Error('Cannot find Storybook iframe');
    }
    channel.on('storybook/resources/add_cssresources', this.onAddCssresources);
  }

  componentWillUnmount() {
    const { channel } = this.props;
    channel.removeListener('storybook/resources/add_cssresources', this.onAddCssresources);
  }

  onAddCssresources(cssresources) {
    this.loadCssresources(cssresources.filter(res => res.picked));
    this.setState(prevState => ({ ...prevState, cssresources }));
  }

  handleChange(i, { target }) {
    const { channel } = this.props;
    const { cssresources = [] } = this.state;
    cssresources[i].picked = target.checked;
    channel.emit('storybook/resources/add_cssresources', cssresources);
  }

  loadCssresources(cssresources) {
    // remove previously added elements!
    this.iframe.contentDocument.head.querySelectorAll(`[${addedElAttr}]`).forEach(eL => {
      if (eL) {
        eL.parentNode.removeChild(eL);
      }
    });

    // add new elements!
    const str = cssresources.map(res => res.code).join('');
    const parsedHtml = this.parser.parseFromString(str, 'text/html');
    const elements = parsedHtml.querySelectorAll('head > *');
    elements.forEach(eL => {
      // add addedElAttr to css elements
      eL.setAttribute(addedElAttr, '');
      this.iframe.contentDocument.head.appendChild(eL);
    });
  }

  render() {
    const { cssresources = [] } = this.state;
    const { active } = this.props;

    if (!active) {
      return null;
    }

    return (
      <PanelWrapper className="addon-cssresources-container">
        {cssresources &&
          cssresources.map(({ name, code, picked }, i) => (
            <div key={name} style={{ padding: 10 }}>
              <div style={{ fontSize: '1.1em', marginBottom: 10 }}>
                <input
                  id={`cssresource${i}`}
                  style={{ fontSize: '1.5em' }}
                  type="checkbox"
                  checked={picked}
                  onChange={this.handleChange.bind(this, i)}
                />
                <label htmlFor={`cssresource${i}`}>#{name}</label>
              </div>
              <SyntaxHighlighter
                language="css"
                style={highlighterTheme}
                customStyle={{ opacity: picked ? 1 : 0.5 }}
              >
                {code}
              </SyntaxHighlighter>
            </div>
          ))}
      </PanelWrapper>
    );
  }
}

CssResourcePanel.propTypes = {
  active: PropTypes.bool.isRequired,
  channel: PropTypes.shape({
    on: PropTypes.func,
    emit: PropTypes.func,
    removeListener: PropTypes.func,
  }).isRequired,
  api: PropTypes.shape({
    onStory: PropTypes.func,
    getQueryParam: PropTypes.func,
    setQueryParams: PropTypes.func,
  }).isRequired,
};
