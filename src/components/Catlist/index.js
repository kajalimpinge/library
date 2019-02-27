import React from 'react';

import { AuthUserContext } from '../Session';
import { withAuthorization } from '../Session';
import * as ROUTES from '../../constants/routes';
import { Link } from 'react-router-dom';
import firebase from "firebase";

class CatlistPage extends React.Component {
    constructor(props) {
        super(props);
        this.ref = firebase.firestore().collection('categories');
        this.unsubscribe = null;
        this.state = {
            categories: [],
            error: ''
        };
    }
    onCollectionUpdate = (querySnapshot) => {
        const categories = [];
        querySnapshot.forEach((doc) => {
            const { title, category_type, status } = doc.data();
            categories.push({
                key: doc.id,
                doc, // DocumentSnapshot
                title,
                category_type,
                status

            });
        });
        console.log(categories);
        this.setState({
            categories
        });
    }
    componentDidMount() {
        this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
    }
    delete(id) {
        firebase.firestore().collection('categories').doc(id).delete().then(() => {
            this.setState({
                error: "Category successfully deleted!"
            });
        }).catch((error) => {
            this.setState({
                error: "Error removing Category: "
            });
        });
    }
    ban(id) {

    }
    render() {
        return (
            <AuthUserContext.Consumer>
                {authUser => (<div>
                    <div className="row padding20">
                        <div className="col-md-4">
                            <h1>Manage Categories</h1>
                        </div>
                        <div className="col-md-8">
                            <div className="action-bar text-right">
                                <Link to={ROUTES.ADDCATEGORY}> <button type="button" className="btn btn-sm btn-primary btn-create">Create New</button></Link>
                            </div>
                        </div>
                    </div>
                    {this.state.activeSuggestion}

                    <div className="row col-md-12  custyle">

                        {this.state.error}
                        <table className="table table-striped custab">
                            <thead>
                                <tr>
                                    <th>Select</th>
                                    <th>Title</th>
                                    <th>Category Type</th>
                                    <th>Status</th>
                                    <th className="text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.categories.map(category =>
                                    <tr>
                                        <td></td>
                                        <td><Link to={`/showcategory/${category.key}`}>{category.title}</Link></td>
                                        <td>{category.category_type==1 ? (
                                            "Event"
                                            ) : (
                                            "Chapel"
                                            )}
                                        </td>
                                        <td>
                                            {category.status ? (
                                                "Active"
                                            ) : (
                                                    "Inactive"
                                                )}
                                        </td>
                                        <td className="text-center"><a onClick={this.delete.bind(this, category.key)} className="actionbutton" title="Delete"><i className="fa fa-trash-o" aria-hidden="true"></i></a>&nbsp;|&nbsp;<Link to={`/editcategory/${category.key}`}><i className="fa fa-pencil" aria-hidden="true"></i></Link></td>
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

export default withAuthorization(authCondition)(CatlistPage);
