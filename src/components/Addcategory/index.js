import React from 'react';

import { AuthUserContext } from '../Session';
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import firebase from "firebase";
class AddcategoryPage extends React.Component {
    constructor() {
        super();
        this.state = {
            title: "",
            category_type: "1",
            categoryresult: false
        };
    }
    updateInput = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    addCategory = e => {
        e.preventDefault();
        const db = firebase.firestore();
        const userRef = db.collection("categories").add({
            title: this.state.title,
            category_type: this.state.category_type,
            status: true,
        });
        this.setState({
            title: "",
            category_type: "",
            userresult: true
        });
        this.props.history.push("/categories");
    };
    render() {
        return (
            <AuthUserContext.Consumer>
                {authUser => (<div>
                    <h1>Add category</h1>

                    {this.state.categoryresult ? <div className='alert alert-success' role='alert'>Category added successfully!</div> : ""}
                    <form onSubmit={this.addCategory}>
                        <div className="form-group">
                            <input
                                type="text"
                                name="title"
                                placeholder="Title"
                                onChange={this.updateInput}
                                value={this.state.title}
                            />
                        </div>
                        <div className="form-group">
                            <select
                                name="category_type"
                                placeholder="Category Type"
                                onChange={this.updateInput}

                            >
                                <option value="1">Event</option>
                                <option value="2">Chappel</option>
                            </select>
                        </div>


                        <div className="form-group"> <button type="submit" className="btn btn-primary">Add Category</button></div>

                    </form>
                </div>
                )}
            </AuthUserContext.Consumer>
        );
    }
}


const authCondition = authUser => !!authUser;

export default withAuthorization(authCondition)(AddcategoryPage);
