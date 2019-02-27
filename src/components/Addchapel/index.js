import React from 'react';

import { AuthUserContext } from '../Session';
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import firebase from "firebase";
import Autocomplete from "../../Autocomplete";
import FileUploader from "react-firebase-file-uploader";

class AddchapelPage extends React.Component {
    constructor() {
        super();



        this.state = {
            title: "",
            category: "",
            categorylist: [],
            tag: "",
            username: "",
            avatar: "",
            audioURL: "",
            isUploading: false,
            isUploadingAudio: false,
            progress: 0,
            avatarURL: "",
            categoryresult: false,
            description:""
        };
        this.ref = firebase.firestore().collection('categories');
        var catlist = this.ref.where('category_type', '==', '2').limit(10000)
            .get()
            .then(results => {
                var catlist = [];
                results.forEach(function (data) {
                    var da = data.data();
                    catlist[data.id] = da.title;
                });
                this.setCategoryList(catlist);
            });
        this.handleClick = this.handleClick.bind(this);

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
    addCategory = e => {
        e.preventDefault();
        console.log(this.state.userInput);
        const db = firebase.firestore();
        const userRef = db.collection("chapels").add({
            title: this.state.title,
            category: this.state.category,
            avatar: this.state.avatarURL,
            audio: this.state.audioURL,
            tag: this.state.tag,
            status: true,
            description: this.state.description,
        });
        this.setState({
            title: "",
            category: "",
            description: "",
            tag:"",
            userresult: true
        });
        this.props.history.push("/chapels");
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

    //Audio upload stars
    handleAudioUploadStart = () => this.setState({ isUploadingAudio: true, audioprogress: 0 });
    handleAudioProgress = audioprogress => this.setState({ audioprogress });
    handleAudioUploadError = error => { this.setState({ isUploadingAudio: false }); console.error(error); };
    handleUploadAudioSuccess = filename => {
        this.setState({ audioprogress: 100, isUploadingAudio: false });
        alert("File uploaded");
        firebase
            .storage()
            .ref("audios")
            .child(filename)
            .getDownloadURL()
            .then(url => this.setState({ audioURL: url }));
    };
    //Audio upload ends
    render() {
        return (
            <AuthUserContext.Consumer>
                {authUser => (<div>
                    <h1>Add Chapel</h1>
                    {this.state.categoryresult ? <div className='alert alert-success' role='alert'>Category added successfully!</div> : ""}
                    <div className="container">
                        <form className="well span10" onSubmit={this.addCategory}>
                            <div className="row">
                                <div className="span3">
                                    <label>Title</label> <input className="span3" name="title"
                                        placeholder="Title"
                                        onChange={this.updateInput}
                                        value={this.state.title} type="text" />
                                    <label>Tag</label> <input className="span3" name="tag"
                                        placeholder="Tag"
                                        onChange={this.updateInput}
                                        value={this.state.tag} type="text" />
                                        
                                    <label>Audio</label>
                                    {this.state.isUploadingAudio && <p>Progress: {this.state.progress}</p>}
                                    {this.state.audioURL && <p>Audio Uploaded{this.state.audioURL}</p>}
                                    <FileUploader
                                        accept="audio/*"
                                        name="audiofile"
                                        randomizeFilename
                                        storageRef={firebase.storage().ref("audios")}
                                        onUploadStart={this.handleAudioUploadStart}
                                        onUploadError={this.handleAudioUploadError}
                                        onUploadSuccess={this.handleUploadAudioSuccess}
                                        onProgress={this.handleAudioProgress}
                                    />
                                    <br /><br />
                                   
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
                                    <textarea className="input-xlarge span5" id="description" name="description" onChange={this.updateInput} rows="10">
                                        {this.state.description}
                                    </textarea>
                                </div>
                            </div>

                            <button className="btn btn-primary pull-right" type=
                                "submit">Add Chapel</button>
                        </form>
                    </div>
                </div>
                )}
            </AuthUserContext.Consumer>
        );
    }
}


const authCondition = authUser => !!authUser;

export default withAuthorization(authCondition)(AddchapelPage);
