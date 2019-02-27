import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../PasswordForget';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const SignInPage = () => (
  <div>
    <SignInForm />
    
  </div>
);

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class SignInFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email, password } = this.state;

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
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
    const { email, password, error } = this.state;

    const isInvalid = password === '' || email === '';

    return (
      <div id="login-row" className="row justify-content-center align-items-center">
      <div id="login-column" className="col-md-6">
          <div className="box">
              <div className="shape1"></div>
              <div className="shape2"></div>
              <div className="shape3"></div>
              <div className="shape4"></div>
              <div className="shape5"></div>
              <div className="shape6"></div>
              <div className="shape7"></div>
              <div className="float">
                  <form className="form" onSubmit={this.onSubmit}>
                      <div className="form-group">
                          <input type="text" name="email" value={email} onChange={this.onChange} type="text" placeholder="Email Address" className="form-control"/>
                      </div>
                      <div className="form-group">
                        <input name="password" value={password} onChange={this.onChange} type="password" placeholder="Password"className="form-control"/>
                      </div>
                      <div className="form-group">
                          <input type="submit" name="submit" disabled={isInvalid}  className="btn btn-info btn-md" value="Sign In"/>
                      </div>
                  </form>
                  <PasswordForgetLink />
    <SignUpLink />
              </div>
          </div>
      </div>
  </div>
      
    );
  }
}

const SignInForm = compose(
  withRouter,
  withFirebase,
)(SignInFormBase);

export default SignInPage;

export { SignInForm };
