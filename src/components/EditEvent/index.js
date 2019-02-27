import React from 'react';

import { AuthUserContext } from '../Session';
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import Autocomplete from "../../Autocomplete";
import FileUploader from "react-firebase-file-uploader";
import { Link } from 'react-router-dom';

import firebase from "firebase";
class EditeventPage extends React.Component {
    constructor(props) {
        super(props);
       
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
            selectedCategory: [],
            showCategory: "",
            categoryresult: false
        };
        
        /*[Categories*/
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
        /*Categories]*/


        /*[EventInfo*/
        this.ref = firebase.firestore().collection('events').doc(this.props.match.params.eventid);
            this.ref.get()
            .then((doc) => {
            if (doc.exists) {
                 this.setEventData(doc);
            } else {
                console.log("No such event found!");
            }
        });
        /*EventInfo]*/
    this.handleClick = this.handleClick.bind(this);

    }
    componentDidMount() {
       
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
        var category_list_arr = [];
        if (eventdata.category) {
            this.handleChange = this.handleChange.bind(this);
            this.setSelectedCategory(eventdata.category);
        } else {
          this.setState({
            showCategory: "Yes"
          });
        }
        /*EventCategoryInfo]*/
                
    }
    handleChange(event) {
        console.log(event.target.value, "teest");
        console.log(this.handleCheck(event.target.value), "state");
        
        if(this.handleCheck(event.target.value) == undefined) {
            this.setState({category: [...this.state.category,event.target.value]});
        } else {
            var array = [...this.state.category]; // make a separate copy of the array
            var index = array.indexOf(event.target.value)
            if (index !== -1) {
                array.splice(index, 1);
                this.setState({category: array});
            }
        }
    }
    setSelectedCategory(catnames) {
        console.log(catnames, "names");
        this.setState({
            selectedCategory: catnames,
            showCategory: "Yes"
        });
    }
    handleCheck(itemselected) {
        return Object.keys(this.state.category).find(key => this.state.category[key] === itemselected);
    }
    updateInput = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    handleClick(itemselected) {
        console.log("itemselected");
        console.log(itemselected);
        this.setState({
            category: Object.keys(this.state.categorylist).find(key => this.state.categorylist[key] === itemselected)
        });
    }
    updateFormData = e => {
        e.preventDefault();
        const db = firebase.firestore();
        const updateRef = firebase.firestore().collection('events').doc(this.state.key);
        updateRef.set({
            title: this.state.title,
            subtitle: this.state.subtitle,
            category: this.state.category,
            avatar: this.state.avatar,
            status: true,
            description: this.state.description,
        }).then((docRef) => {
            this.setState({
                title: "",
                subtitle: "",
                category: [],
                description: "",
                userresult: true
            });
            this.props.history.push("/events");
        }).catch((error) => {
            console.error("Error adding document: ", error);
        });
    };

    //Photo Upload starts
    handleUploadStart = () => this.setState({ isUploading: true, progress: 0 });
    handleProgress = progress => this.setState({ progress });
    handleUploadError = error => { this.setState({ isUploading: false }); console.error(error); };
    handleUploadSuccess = filename => {
        firebase
            .storage()
            .ref("images")
            .child(filename)
            .getDownloadURL()
            .then(url => this.setState({ avatarURL: url,avatar:url, progress: 100, isUploading: false }));
    };
    //Photo Upload Ends

    render() {
        return (
            <AuthUserContext.Consumer>
                {authUser => (<div>

                    {this.state.userresult ? <div className='alert alert-success' role='alert'>Event updated successfully!</div> : ""}

                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <h3 className="panel-title">
                                EDIT EVENT
                            </h3>
                        </div>
                        <div className="panel-body">
                            <Link to={`/events`} className="">Back</Link>
                            <form className="well span10" onSubmit={this.updateFormData}>
                            <div className="row">
                                <div className="span3">
                                    <label>Title</label>
                                     <input className="span3" name="title"
                                        placeholder="Title"
                                        onChange={this.updateInput}
                                        value={this.state.title} type="text" />

                                    <br /><br />
                                    <label>Sub Title</label>
                                     <input className="span3" name="subtitle"
                                        placeholder="Sub Title"
                                        onChange={this.updateInput}
                                        value={this.state.subtitle} type="text" />

                                    <br /><br />

                                    <label>Category</label> {this.state.showCategory && 
                                        <select value={this.state.category} fieldname="category_name" onChange={this.handleChange} multiple={true}>
                                        {this.state.categorylist}
                                      </select>}

                                    <label>Image:</label>
                                    {this.state.isUploading && <p>Progress: {this.state.progress}</p>}
                                    
                                    {this.state.avatar && 
                                        <img width="100" src={this.state.avatar}/>
                                    }
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
                                    <textarea value={this.state.description} className="input-xlarge span5" id="description" name="description" onChange={this.updateInput} rows="10">
                                     </textarea>
                                </div>
                            </div>

                            <button className="btn btn-primary pull-right" type=
                                "submit">Submit</button>
                        </form>
                        </div>
                    </div>


                </div>
                )}
            </AuthUserContext.Consumer>
        );
    }
}


const authCondition = authUser => !!authUser;

export default withAuthorization(authCondition)(EditeventPage);
