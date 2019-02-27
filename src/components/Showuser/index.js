import React from 'react';

import { AuthUserContext } from '../Session';
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import { Link } from 'react-router-dom';

import firebase from "firebase";
class ShowuserPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstname  : "",
            lastname  : "",
            email: "",
            status: "",
        };

        /*[EventInfo*/
        this.ref = firebase.firestore().collection('users').doc(this.props.match.params.userid);
            this.ref.get()
            .then((doc) => {
            if (doc.exists) {
                 this.setUserData(doc);
            } else {
                console.log("No such user found!");
            }
        });
        /*EventInfo]*/

       }
   
    setUserData(doc) {
        const userdata = doc.data();
        this.setState({
            key: doc.id,
            firstname: userdata.firstname,
            lastname: userdata.lastname,
            email: userdata.email,
            status: userdata.status,
        });
        
                
    }
    render() {
        return (
            <AuthUserContext.Consumer>
                {authUser => (<div>
                    <Link to={`/users`} className="">Back</Link>
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <h3 className="panel-title">
                              USER DETAILS
                            </h3>
                        </div>
                        <div className="panel-body">
                            <div className="row">
                                <div className="col-lg-12 col-md-12">
                                   <div className="row">
                                        <div className="col-lg-12 col-md-12">
                                            <div className="tab-content">
                                                <div id="Summery" className="tab-pane fade in active">

                                                    <div className="table-responsive panel">
                                                        <table className="table">
                                                            <tbody>
                                                                <tr>
                                                                    <td className="text-success">First Name</td>
                                                                    <td>{this.state.firstname}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="text-success">Last Name</td>
                                                                    <td>{this.state.lastname}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="text-success">Email</td>
                                                                    <td>{this.state.email}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="text-success">Status</td>
                                                                    <td>{this.state.status==1 ? "Active" : "Inactive"}</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                 </div>
                )}
            </AuthUserContext.Consumer>
        );
    }
}


const authCondition = authUser => !!authUser;

export default withAuthorization(authCondition)(ShowuserPage);
