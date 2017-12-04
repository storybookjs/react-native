import React from 'react';
import PropTypes from 'prop-types';

const Red = props => <span style={{ color: 'red' }} {...props} />;
const TableComponent = ({ propDefinitions }) => {
  const props = propDefinitions.map(
    ({ property, propType, required, description, defaultValue }) => (
      <tr key={property}>
        <td>
          {property}
          {required ? <Red>*</Red> : null}
        </td>
        <td>{propType.name}</td>
        <td>{defaultValue}</td>
        <td>{description}</td>
      </tr>
    )
  );

  return (
    <table>
      <thead>
        <tr>
          <th>name</th>
          <th>type</th>
          <th>default</th>
          <th>description</th>
        </tr>
      </thead>
      <tbody>{props}</tbody>
    </table>
  );
};

TableComponent.defaultProps = {
  propDefinitions: [],
};

TableComponent.propTypes = {
  propDefinitions: PropTypes.arrayOf(
    PropTypes.shape({
      property: PropTypes.string.isRequired,
      propType: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
      required: PropTypes.bool.isRequired,
      description: PropTypes.string,
      defaultValue: PropTypes.any,
    })
  ),
};

export default TableComponent;
