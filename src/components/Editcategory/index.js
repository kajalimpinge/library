import React from 'react';

import { AuthUserContext } from '../Session';
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import firebase from "firebase";
class EditcategoryPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            category_type: "1",
            categoryresult: false
        };

        this.ref = firebase.firestore().collection('categories').doc(this.props.match.params.categoryid);
            this.ref.get()
            .then((doc) => {
            this.setCategory(doc);
        });
    }
    setCategory(doc){
        const catdata = doc.data();
        this.setState({
            key: doc.id,
            title: catdata.title,
            category_type: catdata.category_type,
        });
    }
    updateInput = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    updateFormData = e => {
        e.preventDefault();
        const db = firebase.firestore();
        const updateRef = firebase.firestore().collection('categories').doc(this.state.key);
        updateRef.set({
            title: this.state.title,
            category_type: this.state.category_type,
            status: true,
        }).then((docRef) => {
            this.setState({
                title: "",
                category_type: "",
                userresult: true
            });
            this.props.history.push("/categories");
        }).catch((error) => {
            console.error("Error in updating document: ", error);
        });
    };
    render() {
        return (
            <AuthUserContext.Consumer>
                {authUser => (<div>
                    <h1>Edit Category</h1>

                    {this.state.categoryresult ? <div className='alert alert-success' role='alert'>Category updated successfully!</div> : ""}
                    <form onSubmit={this.updateFormData}>
                        <div className="form-group">
                        <label>Category Name</label>
                            <input
                                type="text"
                                name="title"
                                placeholder="Title"
                                onChange={this.updateInput}
                                value={this.state.title}
                            />
                        </div>
                        <div className="form-group">
                            <label>Category Type</label>
                            <select
                                name="category_type"
                                placeholder="Category Type"
                                onChange={this.updateInput}

                            >
                                <option selected={this.state.category_type==1 ? ("selected") : ''} value="1">Event</option>
                                <option selected={this.state.category_type==2 ? ("selected") : ''}value="2">Chappel</option>
                            </select>
                        </div>


                        <div className="form-group"> <button type="submit" className="btn btn-primary">Update</button></div>

                    </form>
                </div>
                )}
            </AuthUserContext.Consumer>
        );
    }
}


const authCondition = authUser => !!authUser;

export default withAuthorization(authCondition)(EditcategoryPage);
