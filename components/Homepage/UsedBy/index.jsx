import PropTypes from 'prop-types';
import React from 'react';

const User = ({ logo }) => <img src={logo} />;

const UsedBy = ({ users }) => (
  <div id="featured" className="row">
    <div className="col-xs-12">
      <h2>Used By</h2>
      <div className="row">
        {users.map((user, idx) => <User key={idx} {...user} />)}
      </div>
      <hr />
    </div>
  </div>
);

UsedBy.propTypes = {
  users: PropTypes.array,
};

export default UsedBy;
