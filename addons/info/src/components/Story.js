/* eslint no-underscore-dangle: 0 */

import React, { Fragment, Component, createElement } from 'react';
import { isForwardRef } from 'react-is';
import { polyfill } from 'react-lifecycles-compat';
import PropTypes from 'prop-types';
import global from 'global';

import marksy from 'marksy';
import jsxToString from 'react-element-to-jsx-string';
import { Code } from './markdown';
import { getDisplayName, getType } from '../react-utils';

global.STORYBOOK_REACT_CLASSES = global.STORYBOOK_REACT_CLASSES || [];
const { STORYBOOK_REACT_CLASSES } = global;

const stylesheetBase = {
  button: {
    base: {
      fontFamily: 'sans-serif',
      fontSize: '12px',
      display: 'block',
      position: 'fixed',
      border: 'none',
      background: '#027ac5',
      color: '#fff',
      padding: '5px 15px',
      cursor: 'pointer',
    },
    topRight: {
      top: 0,
      right: 0,
      borderRadius: '0 0 0 5px',
    },
  },
  info: {
    position: 'fixed',
    background: 'white',
    top: 0,
    left: 0,
    height: '100vh',
    width: '100vw',
    overflow: 'auto',
    zIndex: 99999,
  },
  children: {
    position: 'relative',
    zIndex: 0,
  },
  infoBody: {
    fontFamily: 'Helvetica Neue, Helvetica, Segoe UI, Arial, freesans, sans-serif',
    color: 'black',
    fontWeight: 300,
    lineHeight: 1.45,
    fontSize: '15px',
    padding: '20px 40px 40px',
    borderRadius: '2px',
    backgroundColor: '#fff',
  },
  infoContent: {
    marginBottom: 0,
  },
  infoStory: {},
  jsxInfoContent: {
    borderTop: '1px solid #eee',
    margin: '20px 0 0 0',
  },
  header: {
    h1: {
      margin: 0,
      padding: 0,
      fontSize: '35px',
    },
    h2: {
      margin: '0 0 10px 0',
      padding: 0,
      fontWeight: 400,
      fontSize: '22px',
    },
    h3: {
      margin: '0 0 10px 0',
      padding: 0,
      fontWeight: 400,
      fontSize: '18px',
    },
    body: {
      borderBottom: '1px solid #eee',
      paddingTop: 10,
      marginBottom: 10,
    },
  },
  source: {
    h1: {
      margin: '20px 0 0 0',
      padding: '0 0 5px 0',
      fontSize: '25px',
      borderBottom: '1px solid #EEE',
    },
  },
  propTableHead: {
    margin: '20px 0 0 0',
  },
};

class Story extends Component {
  constructor(props, ...args) {
    super(props, ...args);
    this.state = {
      open: false,
    };
    this.marksy = marksy({
      createElement,
      elements: props.components,
    });
  }

  _renderStory() {
    const { stylesheet } = this.state;
    const { children } = this.props;

    return (
      <div id="story-root" style={stylesheet.infoStory}>
        {children}
      </div>
    );
  }

  _renderInline() {
    const { stylesheet } = this.state;

    return (
      <Fragment>
        {this._renderInlineHeader()}
        {this._renderStory()}
        <div style={stylesheet.infoPage}>
          <div style={stylesheet.infoBody}>
            {this._getInfoContent()}
            {this._getComponentDescription()}
            {this._getSourceCode()}
            {this._getPropTables()}
          </div>
        </div>
      </Fragment>
    );
  }

  _renderInlineHeader() {
    const { stylesheet } = this.state;

    const infoHeader = this._getInfoHeader();

    return (
      infoHeader && (
        <div style={stylesheet.infoPage}>
          <div style={stylesheet.infoBody}>{infoHeader}</div>
        </div>
      )
    );
  }

  _renderOverlay() {
    const { stylesheet, open } = this.state;
    const { children } = this.props;

    const buttonStyle = {
      ...stylesheet.button.base,
      ...stylesheet.button.topRight,
    };

    const infoStyle = Object.assign({}, stylesheet.info);
    if (!open) {
      infoStyle.display = 'none';
    }

    const openOverlay = () => {
      this.setState({ open: true });
      return false;
    };

    const closeOverlay = () => {
      this.setState({ open: false });
      return false;
    };

    return (
      <Fragment>
        <div style={stylesheet.children}>{children}</div>
        <button
          type="button"
          style={buttonStyle}
          onClick={openOverlay}
          className="info__show-button"
        >
          Show Info
        </button>
        {open ? (
          <div style={infoStyle} className="info__overlay">
            <button
              type="button"
              style={buttonStyle}
              onClick={closeOverlay}
              className="info__close-button"
            >
              ×
            </button>
            <div style={stylesheet.infoPage}>
              <div style={stylesheet.infoBody}>
                {this._getInfoHeader()}
                {this._getInfoContent()}
                {this._getComponentDescription()}
                {this._getSourceCode()}
                {this._getPropTables()}
              </div>
            </div>
          </div>
        ) : null}
      </Fragment>
    );
  }

  _getInfoHeader() {
    const { stylesheet } = this.state;
    const { context, showHeader } = this.props;

    if (!context || !showHeader) {
      return null;
    }

    return (
      <div style={stylesheet.header.body}>
        <h1 style={stylesheet.header.h1}>{context.kind}</h1>
        <h2 style={stylesheet.header.h2}>{context.name}</h2>
      </div>
    );
  }

  _getInfoContent() {
    const { info, showInline } = this.props;
    const { stylesheet } = this.state;

    if (!info) {
      return '';
    }

    if (React.isValidElement(info)) {
      return (
        <div style={showInline ? stylesheet.jsxInfoContent : stylesheet.infoContent}>{info}</div>
      );
    }

    const lines = info.split('\n');
    while (lines[0].trim() === '') {
      lines.shift();
    }
    let padding = 0;
    const matches = lines[0].match(/^ */);
    if (matches) {
      padding = matches[0].length;
    }
    const source = lines.map(s => s.slice(padding)).join('\n');

    return <Fragment>{this.marksy(source).tree}</Fragment>;
  }

  _getComponentDescription() {
    const {
      context: { kind, name },
    } = this.props;
    let retDiv = null;

    const validMatches = [kind, name];

    if (Object.keys(STORYBOOK_REACT_CLASSES).length) {
      Object.keys(STORYBOOK_REACT_CLASSES).forEach(key => {
        if (validMatches.includes(STORYBOOK_REACT_CLASSES[key].name)) {
          const componentDescription = STORYBOOK_REACT_CLASSES[key].docgenInfo.description;
          retDiv = <Fragment>{this.marksy(componentDescription).tree}</Fragment>;
        }
      });
    }

    return retDiv;
  }

  _getSourceCode() {
    const { showSource, children } = this.props;
    const { stylesheet } = this.state;

    if (!showSource) {
      return null;
    }

    return (
      <Fragment>
        <h1 style={stylesheet.source.h1}>Story Source</h1>
        <Code code={jsxToString(children)} language="jsx" format={false} />
      </Fragment>
    );
  }

  _getPropTables() {
    const {
      children,
      propTablesExclude,
      propTableCompare,
      maxPropObjectKeys,
      maxPropArrayLength,
      maxPropStringLength,
      excludedPropTypes,
    } = this.props;
    let { propTables } = this.props;
    const { stylesheet } = this.state;
    const types = new Map();

    if (!propTables) {
      return null;
    }

    if (!children) {
      return null;
    }

    propTables.forEach(type => {
      types.set(type, true);
    });

    // depth-first traverse and collect types
    const extract = innerChildren => {
      if (!innerChildren) {
        return;
      }
      if (Array.isArray(innerChildren)) {
        innerChildren.forEach(extract);
        return;
      }
      if (innerChildren.props && innerChildren.props.children) {
        extract(innerChildren.props.children);
      }
      if (isForwardRef(innerChildren)) {
        try {
          // this might fail because of hooks being used
          extract(innerChildren.type.render(innerChildren.props));
        } catch (e) {
          // do nothing
        }
      }
      if (
        typeof innerChildren === 'string' ||
        typeof innerChildren.type === 'string' ||
        (propTables.length > 0 && // if propTables is set and has items in it
          !propTables.includes(innerChildren.type)) || // ignore types that are missing from propTables
        (Array.isArray(propTablesExclude) && // also ignore excluded types
          propTablesExclude.some(Comp => propTableCompare(innerChildren, Comp)))
      ) {
        return;
      }

      if (innerChildren.type && !types.has(innerChildren.type)) {
        types.set(innerChildren.type, true);
      }
    };

    // extract components from children
    extract(children);

    const array = Array.from(types.keys());
    array.sort((a, b) => (getDisplayName(a) > getDisplayName(b) ? 1 : -1));

    propTables = array.map((type, i) => (
      // eslint-disable-next-line react/no-array-index-key
      <div key={`${getDisplayName(type)}_${i}`}>
        <h3 style={stylesheet.propTableHead}>"{getDisplayName(type)}" Component</h3>
        <this.props.PropTable
          type={getType(type)}
          maxPropObjectKeys={maxPropObjectKeys}
          maxPropArrayLength={maxPropArrayLength}
          maxPropStringLength={maxPropStringLength}
          excludedPropTypes={excludedPropTypes}
        />
      </div>
    ));

    if (!propTables || propTables.length === 0) {
      return null;
    }

    return (
      <Fragment>
        <h1 style={stylesheet.source.h1}>Prop Types</h1>
        {propTables}
      </Fragment>
    );
  }

  render() {
    const { showInline } = this.props;
    return showInline ? this._renderInline() : this._renderOverlay();
  }
}

Story.getDerivedStateFromProps = ({ styles }) => ({ stylesheet: styles(stylesheetBase) });

Story.displayName = 'Story';

Story.propTypes = {
  context: PropTypes.shape({
    kind: PropTypes.string,
    name: PropTypes.string,
  }),
  info: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  propTables: PropTypes.arrayOf(PropTypes.func),
  propTablesExclude: PropTypes.arrayOf(PropTypes.func),
  propTableCompare: PropTypes.func.isRequired,
  showInline: PropTypes.bool,
  showHeader: PropTypes.bool,
  showSource: PropTypes.bool,
  // eslint-disable-next-line react/no-unused-prop-types
  styles: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  components: PropTypes.shape({}),
  maxPropObjectKeys: PropTypes.number.isRequired,
  maxPropArrayLength: PropTypes.number.isRequired,
  maxPropStringLength: PropTypes.number.isRequired,
  excludedPropTypes: PropTypes.arrayOf(PropTypes.string),
};

Story.defaultProps = {
  context: null,
  info: '',
  children: null,
  propTables: null,
  propTablesExclude: [],
  showInline: false,
  showHeader: true,
  showSource: true,
  components: {},
  excludedPropTypes: [],
};

polyfill(Story);

export default Story;
