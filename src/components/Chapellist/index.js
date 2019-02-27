import React from 'react';

import { AuthUserContext } from '../Session';
import { withAuthorization } from '../Session';
import * as ROUTES from '../../constants/routes';
import { Link } from 'react-router-dom';
import firebase from "firebase";

class ChapellistPage extends React.Component {
    constructor(props) {
        super(props);
        this.ref = firebase.firestore().collection('chapels');
        this.unsubscribe = null;
        this.state = {
            chapels: [],
            category_name: '',
            error: ''
        };
    }
    onCollectionUpdate = (querySnapshot) => {
        const chapels = [];
        this.setState({...this.state, chapels : [] });
        this.setState({...this.state, category_name : '' });
        this.setState({...this.state, error : '' });
        querySnapshot.forEach((doc) => {
            const { title, category, status,tag } = doc.data();

            if(doc.data().category!='') {     
                this.ref = firebase
                    .firestore()
                    .collection("categories")
                    .doc(doc.data().category);

                    this.ref.get().then(docData => {
                        if (docData.data() !== undefined && docData.data().title !== undefined) {
                            this.setState({...this.state, category_name : docData.data().title })
                        }

                        this.state.chapels.push({
                            key: doc.id,
                            doc, // DocumentSnapshot
                            title,
  tag,

                           // categoryName: this.state.category_name,
                            status
                        })

                        this.setState({...this.state})
                    });
            } else {
                this.state.chapels.push({
                    key: doc.id,
                    doc, // DocumentSnapshot
                    title,
tag,
                   // categoryName: this.state.category_name,
                    status
                })

                this.setState({...this.state})
            }
        });
    }
    componentDidMount() {
        this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
    }
    delete(id) {
        firebase.firestore().collection('chapels').doc(id).delete().then(() => {
            this.setState({
                error: "Chapel successfully deleted!"
            });
        }).catch((error) => {
            this.setState({
                error: "Error removing Chapel: "
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
                            <h1>Manage Chapels</h1>
                        </div>
                        <div className="col-md-8">
                            <div className="action-bar text-right">
                                <Link to={ROUTES.ADDCHAPEL}> <button type="button" className="btn btn-sm btn-primary btn-create">Create New</button></Link>
                            </div>
                        </div>
                    </div>


                    <div className="row col-md-12  custyle">

                        {this.state.error}
                        <table className="table table-striped custab">
                            <thead>
                                <tr>
                                    <th>Select</th>
                                    <th>Title</th>
<th>Tag</th>

                                 
                                    <th>Status</th>
                                    <th className="text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.chapels.map(chapel =>
                                    <tr>
                                        <td></td>
                                        <td><Link to={`/showchapel/${chapel.key}`}>{chapel.title}</Link></td>
<td>{chapel.tag}</td>
                                       
                                        <td>
                                            {chapel.status ? (
                                                "Active"
                                            ) : (
                                                    "Inactive"
                                                )}
                                        </td>
                                        <td className="text-center"><a onClick={this.delete.bind(this, chapel.key)} className="actionbutton" title="Delete"><i className="fa fa-trash-o" aria-hidden="true"></i></a>&nbsp;|&nbsp;<Link to={`/editchapel/${chapel.key}`}><i className="fa fa-pencil" aria-hidden="true"></i></Link></td>
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

export default withAuthorization(authCondition)(ChapellistPage);
