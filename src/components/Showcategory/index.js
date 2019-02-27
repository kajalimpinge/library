import React from 'react';

import { AuthUserContext } from '../Session';
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import { Link } from 'react-router-dom';

import firebase from "firebase";
class ShowcategoryPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            category_type: "",
            status: "",
        };

        /*[EventInfo*/
        this.ref = firebase.firestore().collection('categories').doc(this.props.match.params.categoryid);
            this.ref.get()
            .then((doc) => {
            if (doc.exists) {
                 this.setCategoryData(doc);
                 console.log("Here");
            } else {
                console.log("No such category found!");
            }
        });
        /*EventInfo]*/

       }
   
    setCategoryData(doc) {
        const categorydata = doc.data();
        this.setState({
            key: doc.id,
            title: categorydata.title,
            category_type: categorydata.category_type,
            status: categorydata.status,
        });
        
                
    }
    render() {
        return (
            <AuthUserContext.Consumer>
                {authUser => (<div>
                    <Link to={`/categories`} className="">Back</Link>
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <h3 className="panel-title">
                              CATEGORY DETAILS
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
                                                                    <td className="text-success">Title</td>
                                                                    <td>{this.state.title}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="text-success">Category Type</td>
                                                                    <td>{this.state.category_type==1 ? "Event" : "Chapel"}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="text-success">Category status</td>
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

export default withAuthorization(authCondition)(ShowcategoryPage);
