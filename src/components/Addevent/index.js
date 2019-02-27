import React from 'react';

import { AuthUserContext } from '../Session';
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import firebase from "firebase";
import Autocomplete from "../../Autocomplete";
import FileUploader from "react-firebase-file-uploader";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
class AddeventPage extends React.Component {
    constructor() {
        super();

        this.state = {
            title: "",
            subtitle: "",
            category: [],
            categorylist: [],
            username: "",
            startDate: new Date(),
            avatar: "",
            progress: 0,
            avatarURL: "",
            description: "",
            categoryresult: false
        };
        this.ref = firebase.firestore().collection('categories');
        var catlist = this.ref.where('category_type', '==', '1').limit(10000)
            .get()
            .then(results => {
                var catlist = [];
                results.forEach(function (data) {
                    var da = data.data();   
                    catlist.push(<option value={data.id} selected={true}>{da.title}</option>); 
                });
                this.setCategoryList(catlist);
            });
        this.handleChange = this.handleChange.bind(this);

    }
    handleDateChange(date) {
        this.setState({
            startDate: date
        });
    }
    setCategoryList(catlist) {
        this.setState({
            categorylist: catlist
        });
    }
    updateInput = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    handleClick(itemselected) {
        console.log('Click happened' + itemselected);
        this.setState({
            category: Object.keys(this.state.categorylist).find(key => this.state.categorylist[key] === itemselected)
        });
    }
    handleCheck(itemselected) {
        return Object.keys(this.state.category).find(key => this.state.category[key] === itemselected);
    }
    handleChange(event) {
        console.log(event.target.value, "teest");
        console.log(this.handleCheck(event.target.value), "handle check");

        if(this.handleCheck(event.target.value) == undefined)
        {
            this.setState({category: [...this.state.category,event.target.value]});
        }
        else
        {
            var array = [...this.state.category]; // make a separate copy of the array
            var index = array.indexOf(event.target.value)
            if (index !== -1) {
                array.splice(index, 1);
                this.setState({category: array});
            }
        }
        console.log(this.state.category, "category_state");
    }
    addCategory = e => {
        e.preventDefault();
        console.log(this.state.userInput);
        const db = firebase.firestore();
        const userRef = db.collection("events").add({
            title: this.state.title,
            subtitle: this.state.subtitle,
            category: this.state.category,
            avatar: this.state.avatarURL,
            status: true,
created_date:this.state.startDate,
            description: this.state.description,
        });
        this.setState({
            title: "",
            subtitle: "",
created_date:"",
            category: "",
            description: "",
            userresult: true
        });
        this.props.history.push("/events");
    };
    //Photo Upload starts
    handleUploadStart = () => this.setState({ isUploading: true, progress: 0 });
    handleProgress = progress => this.setState({ progress });
    handleUploadError = error => { this.setState({ isUploading: false }); console.error(error); };
    handleUploadSuccess = filename => {
        this.setState({ avatar: filename, progress: 100, isUploading: false });
        firebase
            .storage()
            .ref("images")
            .child(filename)
            .getDownloadURL()
            .then(url => this.setState({ avatarURL: url }));
    };
    //Photo Upload Ends

    render() {
        return (
            <AuthUserContext.Consumer>
                {authUser => (<div>
                    <h1>Add Event</h1>
                    {this.state.categoryresult ? <div className='alert alert-success' role='alert'>Category added successfully!</div> : ""}
                    <div className="container">
                        <form className="well span10" onSubmit={this.addCategory}>
                            <div className="row">
                                <div className="span3">
                                    <label>Title</label> <input className="span3" name="title"
                                        placeholder="Title"
                                        onChange={this.updateInput}
                                        value={this.state.title} type="text" />

                                    <br /><br />

                                    <label>Sub Title</label> <input className="span3" name="subtitle"
                                        placeholder="Sub Title"
                                        onChange={this.updateInput}
                                        value={this.state.subtitle} type="text" />

                                    <br /><br />

                                    <label>Category</label> <select value={this.state.category} fieldname="category_name" onChange={this.handleChange} multiple={true}>
                                        {this.state.categorylist}
                                      </select>
                                    
                                    <label>Image:</label>
                                    {this.state.isUploading && <p>Progress: {this.state.progress}</p>}
                                    <FileUploader
                                        accept="image/*"
                                        name="avatar"
                                        randomizeFilename
                                        storageRef={firebase.storage().ref("images")}
                                        onUploadStart={this.handleUploadStart}
                                        onUploadError={this.handleUploadError}
                                        onUploadSuccess={this.handleUploadSuccess}
                                        onProgress={this.handleProgress}
                                    />
                                </div>

                                <div className="span6">
                                    <label>Description</label>
                                    <textarea className="input-xlarge span5" id="description" name="description" onChange={this.updateInput}
                                        rows="10">{this.state.description}
                                    </textarea>
                                </div>
                            </div>

                            <button className="btn btn-primary pull-right" type=
                                "submit">Add Event</button>
                        </form>
                    </div>
                </div>
                )}
            </AuthUserContext.Consumer>
        );
    }
}


const authCondition = authUser => !!authUser;

export default withAuthorization(authCondition)(AddeventPage);
