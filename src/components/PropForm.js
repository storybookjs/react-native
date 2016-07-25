import React from 'react';

import PropField from './PropField';

const stylesheet = {
  propForm: {
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

    if (!propArray.length) {
      return <small>No knobs created!</small>;
    }

    propArray.sort(function (a, b) {
      return a.name > b.name;
    });

    return (
      <form style={stylesheet.propForm}>
        {propArray.map(field => (
          <div key={field.name}>
            <PropField
              name={field.name}
              type={field.type}
              value={field.value}
              onChange={this._onFieldChange}
            />
          </div>
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
