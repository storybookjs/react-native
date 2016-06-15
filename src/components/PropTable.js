import React from 'react';

const PropTypesMap = new Map();
for (let typeName in React.PropTypes) {
  if (!React.PropTypes.hasOwnProperty(typeName)) {
    continue
  }
  const type = React.PropTypes[typeName];
  PropTypesMap.set(type, typeName);
}

export default class PropTable extends React.Component {
  static displayName = 'PropTable';
  static propTypes = {
    comp: React.PropTypes.func
  };

  render () {
    const comp = this.props.comp;

    if (!comp) {
      return null;
    }

    const props = [];
    for (let property in comp.propTypes) {
      if (!comp.propTypes.hasOwnProperty(property)) {
        continue
      }
      const type = comp.propTypes[property];
      const propType = PropTypesMap.get(type) || 'other';
      const required = type.isRequired === undefined ? 'yes' : 'no';
      const defaults = '-';
      props.push({property, propType, required, defaults});
    }

    return (
      <table>
        <thead>
          <tr>
            <th>property</th>
            <th>propType</th>
            <th>required</th>
            <th>defaults</th>
          </tr>
        </thead>
        <tbody>
          {props.map(row => (
            <tr>
              <td>{row.property}</td>
              <td>{row.propType}</td>
              <td>{row.required}</td>
              <td>{row.defaults}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}
