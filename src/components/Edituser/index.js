import React from 'react';

import { AuthUserContext } from '../Session';
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import { Link } from 'react-router-dom';

import firebase from "firebase";
class EdituserPage extends React.Component {
    constructor() {
        super();
        this.state = {
            key: '',
            firstname: "",
            lastname: "",
            email: "",
        };
    }
    componentDidMount() {
        const ref = firebase.firestore().collection('users').doc(this.props.match.params.userid);
        ref.get().then((doc) => {
            if (doc.exists) {
                const user = doc.data();
                this.setState({
                    key: doc.id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email
                });
            } else {
                console.log("No such user!");
            }
        });
    }

    onChange = (e) => {
        const state = this.state
        state[e.target.name] = e.target.value;
        this.setState({ user: state });
    }

    onSubmit = (e) => {
        e.preventDefault();

        const { firstname, lastname, email } = this.state;

        const updateRef = firebase.firestore().collection('users').doc(this.state.key);
        updateRef.set({
            firstname,
            lastname,
            email
        }).then((docRef) => {
            this.setState({
                key: '',
                firstname: '',
                lastname: '',
                email: ''
            });
            this.props.history.push("/users/")
        })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
    }
    render() {
        return (
            <AuthUserContext.Consumer>
                {authUser => (<div>

                    {this.state.userresult ? <div className='alert alert-success' role='alert'>User updated successfully!</div> : ""}

                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <h3 className="panel-title">
                                EDIT USER
                            </h3>
                        </div>
                        <div className="panel-body">
                            <Link to={`/users`} className="">Back</Link>
                            <form onSubmit={this.onSubmit}>
                                <div className="form-group">
                                    <label for="firstname">First Name:</label>
                                    <input type="text" className="form-control" name="firstname" value={this.state.firstname} onChange={this.onChange} placeholder="Title" />
                                </div>
                                <div className="form-group">
                                    <label for="lastname">Last Name:</label>
                                    <input type="text" className="form-control" name="lastname" value={this.state.lastname} onChange={this.onChange} placeholder="Description" />
                                </div>
                                <div className="form-group">
                                    <label for="email">Email:</label>
                                    <input type="text" className="form-control" name="email" value={this.state.email} onChange={this.onChange} placeholder="Author" />
                                </div>
                                <button type="submit" className="btn btn-success">Submit</button>
                            </form>
                        </div>
                    </div>


                </div>
                )}
            </AuthUserContext.Consumer>
        );
    }
}


const authCondition = authUser => !!authUser;

export default withAuthorization(authCondition)(EdituserPage);
