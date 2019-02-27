import React from 'react';

import { AuthUserContext } from '../Session';
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import { Link } from 'react-router-dom';

import firebase from "firebase";
class ShowchapelPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            category: "",
            avatar: "",
            audio: "",
            status: "",
            description: "",
        };

        /*[EventInfo*/
        this.ref = firebase.firestore().collection('chapels').doc(this.props.match.params.chapelid);
            this.ref.get()
            .then((doc) => {
            if (doc.exists) {
                 this.setChapelData(doc);
                 console.log("doc");
            } else {
                console.log("No such chapel found!");
            }
        });
        /*EventInfo]*/

       }
   
    setChapelData(doc) {
        const chapeldata = doc.data();
        this.setState({
            key: doc.id,
            title: chapeldata.title,
            category: chapeldata.category,
            avatar: chapeldata.avatar,
            audio: chapeldata.audio,
            description: chapeldata.description,
        });
        
        /*[EventCategoryInfo*/
        if(chapeldata.category){
            this.ref = firebase.firestore().collection('categories').doc(this.state.category);
                this.ref.get()
                .then((doc) => {
                this.setSelectedCategory(doc.data().title);
            });
        }
        /*EventCategoryInfo]*/
                
    }
    setSelectedCategory(catname) {
        this.setState({
            selectedCategory: catname
        });
        console.log(this.state.selectedCategory);
    }
    render() {
        return (
            <AuthUserContext.Consumer>
                {authUser => (<div>
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <h3 className="panel-title">
                              CHAPEL DETAILS
                            </h3>
                        </div>
                        <div className="panel-body">
                                <Link to={`/chapels`} className="">Back</Link>
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
                                                                    <td className="text-success">Category</td>
                                                                    <td>{this.state.selectedCategory}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="text-success">Description</td>
                                                                    <td>{this.state.description}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="text-success">Audio</td>
                                                                    <td>{this.state.audio && <a href={this.state.audio}>Open</a>}</td>
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

export default withAuthorization(authCondition)(ShowchapelPage);
