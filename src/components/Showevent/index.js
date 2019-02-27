import React from 'react';

import { AuthUserContext } from '../Session';
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import { Link } from 'react-router-dom';

import firebase from "firebase";
class ShoweventPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            subtitle: "",
            category: [],
            selectedCategory: [],
            avatar: "",
            description: "",
        };

        /*[EventInfo*/
        this.ref = firebase.firestore().collection('events').doc(this.props.match.params.eventid);
            this.ref.get()
            .then((doc) => {
            if (doc.exists) {
                 this.setEventData(doc);
                 console.log("doc");
            } else {
                console.log("No such event found!");
            }
        });
        /*EventInfo]*/
    }
   
    setEventData(doc) {
        const eventdata = doc.data();
        this.setState({
            key: doc.id,
            title: eventdata.title,
            subtitle: eventdata.subtitle,
            category: eventdata.category,
            avatar: eventdata.avatar,
            description: eventdata.description,
        });
        /*[EventCategoryInfo*/
        const category_list_arr = [];
        if (eventdata.category) {
            for (let i = 0; i < eventdata.category.length; i++) {
              this.ref = firebase
                .firestore()
                .collection("categories")
                .doc(eventdata.category[i]);
              this.ref.get().then(doc1 => {
                if (doc1.data() !== undefined && doc1.data().title !== undefined) {
                    category_list_arr.push(doc1.data().title);
                    this.setState({...this.state, selectedCategory : category_list_arr })
                }
              });
            }
        } 
        /*EventCategoryInfo]*/           
    }
    render() {
        return (
            <AuthUserContext.Consumer>
                {authUser => (<div>

                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <h3 className="panel-title">
                              EVENT DETAILS
                            </h3>
                        </div>
                        <div className="panel-body">
                                <Link to={`/events`} className="">Back</Link>
                            <div className="row">
                                <div className="col-lg-12 col-md-12">
                                   <div className="row">
                                        <div className="col-lg-3 col-md-3">
                                            <center>
                                                <span className="text-left">
                                                {this.state.avatar ? 
                                                    <img src={this.state.avatar}/> :
                                                    <img src="/no_image.png"/> 
                                                }
                                                </span>
                                            </center>
                                         </div>
                                        <div className="col-lg-9 col-md-9">
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
                                                                    <td className="text-success">Sub Title</td>
                                                                    <td>{this.state.subtitle}</td>
                                                                </tr>

                                                                <tr>
                                                                    <td className="text-success">Category</td>
                                                                    <td>{ this.state.selectedCategory.length > 0 && this.state.selectedCategory.join(", ")}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="text-success">Description</td>
                                                                    <td>{this.state.description}</td>
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

export default withAuthorization(authCondition)(ShoweventPage);
