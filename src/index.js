import React from 'react';
import Remarkable from 'react-remarkable';

const PropTypesMap = new Map();
for (let typeName in React.PropTypes) {
  if (!React.PropTypes.hasOwnProperty(typeName)) {
    continue
  }
  const type = React.PropTypes[typeName];
  PropTypesMap.set(type, typeName);
}

export default class Story extends React.Component {
  static displayName = 'Story';
  static propTypes = {
    propTables: React.PropTypes.arrayOf(React.PropTypes.func),
    context: React.PropTypes.object,
    info: React.PropTypes.string,
  }

  stylesheet = {
    link: {
      base: {
        fontFamily: 'sans-serif',
        fontSize: 12,
        display: 'block',
        position: 'absolute',
        textDecoration: 'none',
        background: '#28c',
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
      position: 'absolute',
      background: 'white',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      padding: '0 40px',
      overflow: 'auto',
    },
  }

  constructor(...args) {
    super(...args);
    this.state = {open: false};
  }

  openInfo() {
    this.setState({open: true});
    return false;
  }

  closeInfo() {
    this.setState({open: false});
    return false;
  }

  render() {
    const linkStyle = {
      ...this.stylesheet.link.base,
      ...this.stylesheet.link.topRight,
    }
    const infoStyle = Object.assign({}, this.stylesheet.info);
    if (!this.state.open) {
      infoStyle.display = 'none';
    }

    return (
      <div>
        {this.props.children}
        <a style={linkStyle} onClick={() => this.openInfo()}>?</a>
        <div style={infoStyle}>
          <a style={linkStyle} onClick={() => this.closeInfo()}>×</a>
          <div className='storybook-story-info-page'>
            <div className='storybook-story-info-body'>
              <Remarkable source={this._getInfoContent()}></Remarkable>
            </div>
          </div>
        </div>
      </div>
    );
  }

  _getInfoContent() {
    if (!this.props.info) {
      return '';
    }
    const lines = this.props.info.split('\n');
    while (lines[0].trim() === '') {
      lines.shift();
    }
    let padding = 0;
    const matches = lines[0].match(/^ */);
    if (matches) {
      padding = matches[0].length;
    }
    let header = '';
    if (this.props.context) {
      header = [
        `# ${this.props.context.kind}`,
        `## ${this.props.context.story}`
      ].join('\n');
    }
    const content = lines.map(s => s.slice(padding)).join('\n');
    const extras = this._getPropTables();
    return [ header, content, extras ].join('\n');
  }

  _getPropTables() {
    if (!this.props.propTables) {
      return '';
    }
    const tables = this.props.propTables.map(this._getPropTable.bind(this));
    return tables.join('\n\n');
  }

  _getPropTable(Comp) {
    if (!Comp) {
      return '';
    }
    const table = [
      `### <${Comp.displayName || Comp.name} /> PropTypes`,
      '| property | propType | required | defaults |',
      '|----------|----------|----------|----------|',
    ];
    for (let property in Comp.propTypes) {
      if (!Comp.propTypes.hasOwnProperty(property)) {
        continue
      }
      const type = Comp.propTypes[property];
      const propType = PropTypesMap.get(type) || '-';
      const required = type.isRequired === undefined ? 'yes' : 'no';
      const defaults = this._getDefaultProp(property);
      table.push(`| ${property} | ${propType} | ${required} | ${defaults} |`);
    }
    return table.join('\n');
  }

  _getDefaultProp(property) {
    return '-';
  }
}
