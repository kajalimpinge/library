import React from 'react';

import { AuthUserContext } from '../Session';
import { withAuthorization } from '../Session';
import * as ROUTES from '../../constants/routes';
import { Link } from 'react-router-dom';
import firebase from "firebase";

class EventlistPage extends React.Component {
    constructor(props) {
        super(props);
        this.ref = firebase.firestore().collection('events').orderBy('created_date','desc');
        this.unsubscribe = null;
        this.state = {
            events: [],
            category_name: [],
            error: '',
        };
    }
    onCollectionUpdate = (querySnapshot) => {
        //const events = [];
        this.setState({...this.state, events : [] });
        querySnapshot.forEach((doc) => { 
            const categories = [];
            const { title, subtitle, category, status } = doc.data();
            var category_list_arr = [];
            if(doc.data().category) { 
                //console.log(category, "category");
                category_list_arr = [];
                for (let i = 0; i < category.length; i++) {
                    console.log(category[i]);
                    this.ref = firebase
                        .firestore()
                        .collection("categories")
                        .doc(category[i]);
                    this.ref.get().then(doc1 => {
                        if (doc1.data() !== undefined && doc1.data().title !== ''&& doc1.data().title !== null) {                 
                            category_list_arr.push(doc1.data().title);
                            this.setState({...this.state, category_name : category_list_arr })
                        }
                    });
                }

                // console.log(category_list_arr, "mmm");
                this.state.events.push({
                    key: doc.id,
                    doc, // DocumentSnapshot
                    title,
                    subtitle,
                    categoryName: category_list_arr,
                    status,
createdAt: doc.data().created_date
                })

                this.setState({...this.state})
            } else {
                this.state.events.push({
                    key: doc.id,
                    doc, // DocumentSnapshot
                    title,
                    subtitle,
createdAt: doc.data().created_date,
                    categoryName: this.state.category_name,
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
        firebase.firestore().collection('events').doc(id).delete().then(() => {
            this.setState({
                error: "Event successfully deleted!"
            });
        }).catch((error) => {
            this.setState({
                error: "Error removing Event: "
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
                            <h1>Manage Events</h1>
                        </div>
                        <div className="col-md-8">
                            <div className="action-bar text-right">
                                <Link to={ROUTES.ADDEVENT}> <button type="button" className="btn btn-sm btn-primary btn-create">Create New</button></Link>
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
                                    <th>Sub Title</th>
                                    <th>Category</th>
<th>Created Date</th>
                                    <th>Status</th>
                                    <th className="text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.events.map(event =>

                                    <tr key={event.key}>
                                        <td></td>
                                        <td><Link to={`/showevent/${event.key}`}>{event.title}</Link></td>
                                        <td>{event.subtitle}</td>
                                        <td>{event.categoryName.join(", ")}</td>
<td>{new Date(event.createdAt).getDate()}.{new Date(event.createdAt).getMonth()+1}.{new Date(event.createdAt).getFullYear()}</td>

                                        <td>
                                            {event.status ? (
                                                "Active"
                                            ) : (
                                                    "Inactive"
                                                )}
                                        </td>
                                        <td className="text-center"><a onClick={this.delete.bind(this, event.key)} className="actionbutton" title="Delete"><i className="fa fa-trash-o" aria-hidden="true"></i></a>&nbsp;|&nbsp;<Link to={`/editevent/${event.key}`}><i className="fa fa-pencil" aria-hidden="true"></i></Link></td>
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

export default withAuthorization(authCondition)(EventlistPage);
