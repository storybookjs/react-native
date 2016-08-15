import React from 'react';

import PropField from './PropField';

const stylesheet = {
  propForm: {
    fontFamily: `
      -apple-system, ".SFNSText-Regular", "San Francisco", "Roboto",
      "Segoe UI", "Helvetica Neue", "Lucida Grande", sans-serif
    `,
    display: 'table',
    boxSizing: 'border-box',
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '5px',
  },
};

export default class propForm extends React.Component {
  constructor() {
    super();
    this._onFieldChange = this.onFieldChange.bind(this);
  }

  onFieldChange(name, value) {
    const change = { name, value };
    this.props.onFieldChange(change);
  }

  render() {
    const fields = this.props.fields;
    const propArray = Object.keys(fields).map(key => (fields[key]));

    propArray.sort(function (a, b) {
      return a.name > b.name;
    });

    return (
      <form style={stylesheet.propForm}>
        {propArray.map(field => (
          <PropField
            key={field.name}
            name={field.name}
            type={field.type}
            value={field.value}
            onChange={this._onFieldChange}
          />
        ))}
      </form>
    );
  }
}

propForm.displayName = 'propForm';

propForm.propTypes = {
  fields: React.PropTypes.object.isRequired,
  onFieldChange: React.PropTypes.func.isRequired,
};
