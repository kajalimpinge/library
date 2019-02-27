import React from 'react';

import { AuthUserContext } from '../Session';
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import firebase from "firebase";
class AdduserPage extends React.Component {
  constructor() {
    super();
    this.state = {
      newuseremail: "",
      firstname: "",
      lastname: "",
      password: "",
      userresult: false
    };
  }
  updateInput = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  addUser = e => {
    e.preventDefault();
    const db = firebase.firestore();
    // db.settings({
    //  timestampsInSnapshots: true
    //});
    const userRef = db.collection("users").add({
      firstname: this.state.firstname,
      lastname: this.state.lastname,
      status: true,
      password: "1212",
      email: this.state.newuseremail,
    });
    this.setState({
      firstname: "",
      lastname: "",
      password: "",
      newuseremail: "",
      userresult: true
    });
    // this.props.history.push("/")
  };
  render() {
    return (
      <AuthUserContext.Consumer>
        {authUser => (<div>
          <h1>Add user</h1>

          {this.state.userresult ? <div className='alert alert-success' role='alert'>User added successfully!</div> : ""}
          <form onSubmit={this.addUser}>
            <div className="form-group">
              <input
                type="text"
                name="firstname"
                placeholder="First name"
                onChange={this.updateInput}
                value={this.state.firstname}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="lastname"
                placeholder="Last name"
                onChange={this.updateInput}
                value={this.state.lastname}
              />
            </div>

            <div className="form-group">
              <input
                type="email"
                name="newuseremail"
                placeholder="Email" onChange={this.updateInput} value={this.state.newuseremail} /></div>

            <div className="form-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={this.state.password}
                onChange={this.updateInput}
              /></div>

            <div className="form-group"> <button type="submit" className="btn btn-primary">Add User</button></div>

          </form>
        </div>
        )}
      </AuthUserContext.Consumer>
    );
  }
}


const authCondition = authUser => !!authUser;

export default withAuthorization(authCondition)(AdduserPage);
