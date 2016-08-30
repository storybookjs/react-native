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
    maxWidth: '500px',
    borderCollapse: 'separate',
    borderSpacing: '5px',
  },
};

export default class propForm extends React.Component {
  constructor() {
    super();
    this._onFieldChange = this.onFieldChange.bind(this);
  }

  onFieldChange(name, type, value) {
    const change = { name, type, value };
    this.props.onFieldChange(change);
  }

  render() {
    const fields = this.props.fields;

    fields.sort(function (a, b) {
      return a.name > b.name;
    });

    return (
      <form style={stylesheet.propForm}>
        {fields.map(field => (
          <PropField
            key={field.name}
            name={field.name}
            type={field.type}
            value={field.value}
            onChange={this._onFieldChange.bind(null, field.name, field.type)}
          />
        ))}
      </form>
    );
  }
}

propForm.displayName = 'propForm';

propForm.propTypes = {
  fields: React.PropTypes.array.isRequired,
  onFieldChange: React.PropTypes.func.isRequired,
};
