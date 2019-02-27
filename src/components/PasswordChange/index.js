import React, { Component } from 'react';

import { withFirebase } from '../Firebase';

const INITIAL_STATE = {
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class PasswordChangeForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { passwordOne } = this.state;

    this.props.firebase
      .doPasswordUpdate(passwordOne)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { passwordOne, passwordTwo, error } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo || passwordOne === '';

    return (

<form className="form-horizontal" onSubmit={this.onSubmit}>
<fieldset>

<legend></legend>

<div className="form-group">
  <label className="col-md-4 control-label" for="passwordOne">Password</label>  
  <div className="col-md-5">
  <input name="passwordOne" value={passwordOne} onChange={this.onChange} type="password" placeholder="New Password" className="form-control input-md" />
  </div>
</div>

<div className="form-group">
  <label className="col-md-4 control-label" for="descricao">Confirm New Password</label>  
  <div className="col-md-5">
  <input name="passwordTwo" value={passwordTwo} onChange={this.onChange} type="password" placeholder="Confirm New Password"className="form-control input-md"/>
  </div>
</div>



<button disabled={isInvalid} type="submit">
  Reset My Password
</button>
{error && <p>{error.message}</p>}

</fieldset>
</form>

    );
  }
}

export default withFirebase(PasswordChangeForm);