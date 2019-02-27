import React from 'react';

import { AuthUserContext } from '../Session';
import { withAuthorization } from '../Session';
import * as ROUTES from '../../constants/routes';
import { Link } from 'react-router-dom';
import firebase from "firebase";

class UsersPage extends React.Component {
  constructor(props) {
    super(props);
    this.ref = firebase.firestore().collection('users');
    this.unsubscribe = null;
    this.state = {
      users: [],
      error: ''
    };
  }
  onCollectionUpdate = (querySnapshot) => {
    const users = [];
    querySnapshot.forEach((doc) => {
      const { firstname, lastname, email, status } = doc.data();
      users.push({
        key: doc.id,
        doc, // DocumentSnapshot
        firstname,
        lastname,
        email,
        status
      });
    });
    console.log(users);
    this.setState({
      users
    });
  }
  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }
  delete(id) {
    firebase.firestore().collection('users').doc(id).delete().then(() => {
      this.setState({
        error: "User successfully deleted!"
      });
    }).catch((error) => {
      this.setState({
        error: "Error removing user: "
      });
    });
  }
  ban(id) {

  }
  render() {
    return (
      <AuthUserContext.Consumer>
        {authUser => (<div>
          <h1>Manage Users</h1>
          <div className="row col-md-12  custyle">
            <div className="action-bar text-right">
              <Link to={ROUTES.ADDUSERS}> <button type="button" className="btn btn-sm btn-primary btn-create">Create New</button></Link>
            </div>
            {this.state.error}
            <table className="table table-striped custab">
              <thead>
                <tr>
                  <th>Select</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {this.state.users.map(user =>
                  <tr>
                    <td></td>
                    <td><Link to={`/showuser/${user.key}`}>{user.firstname}</Link></td>
                    <td>{user.lastname}</td>
                    <td>{user.email}</td>
                    <td>
                      {user.status ? (
                        "Active"
                      ) : (
                          "Inactive"
                        )}
                    </td>
                    <td className="text-center"><a onClick={this.ban.bind(this, user.key)} className="actionbutton" title="Ban"><i className="fa fa-ban" aria-hidden="true"></i></a>&nbsp;|&nbsp;<a onClick={this.delete.bind(this, user.key)} className="actionbutton" title="Delete"><i className="fa fa-trash-o" aria-hidden="true"></i></a>&nbsp;|&nbsp;<Link to={`/edituser/${user.key}`}><i className="fa fa-pencil" aria-hidden="true"></i></Link></td>
                  </tr>
                )}


              </tbody>
            </table>
          </div>


        </div>
        )}
      </AuthUserContext.Consumer>
    );
  }


}


const authCondition = authUser => !!authUser;

export default withAuthorization(authCondition)(UsersPage);
