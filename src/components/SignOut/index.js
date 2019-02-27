import React from 'react';

import { withFirebase } from '../Firebase';

const SignOutButton = ({ firebase }) => (
  
  <a href="javascript:void(0);" onClick={firebase.doSignOut}>
  <i className="fa fa-users fa-lg"></i> Sign Out
  </a>
);

export default withFirebase(SignOutButton);
