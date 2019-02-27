import React from "react";

import { AuthUserContext } from "../Session";
import { withAuthorization } from "../Session";
import { withFirebase } from "../Firebase";
import Autocomplete from "../../Autocomplete";
import FileUploader from "react-firebase-file-uploader";
import { Link } from "react-router-dom";

import firebase from "firebase";
class EditchapelPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      category: "",
      categorylist: [],
      username: "",
      startDate: new Date(),
      avatar: "",
tag:"",
      audio: "",
      progress: 0,
      avatarURL: "",
      audioURL: "",
      isUploading: false,
      isUploadingAudio: false,
      description: "",
      selectedCategory: "",
      showCategory: "",
      categoryresult: false
    };

    /*[Categories*/
    this.ref = firebase.firestore().collection("categories");
    var catlist = this.ref
      .where("category_type", "==", "2")
      .limit(10000)
      .get()
      .then(results => {
        var catlist = [];
        results.forEach(function(data) {
          var da = data.data();
          catlist[data.id] = da.title;
        });
        this.setCategoryList(catlist);
      });
    /*Categories]*/

    /*[EventInfo*/
    this.ref = firebase
      .firestore()
      .collection("chapels")
      .doc(this.props.match.params.chapelid);
    this.ref.get().then(doc => {
      if (doc.exists) {
        this.setChapelData(doc);
      } else {
        console.log("No such chapel found!");
      }
    });
    /*EventInfo]*/
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {}
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
  setChapelData(doc) {
    const chapeldata = doc.data();
    this.setState({
      key: doc.id,
      title: chapeldata.title,
      category: chapeldata.category,
      avatar: chapeldata.avatar,
      audio: chapeldata.audio,
tag: chapeldata.tag,
      audioURL: chapeldata.audio,
      description: chapeldata.description
    });

    /*[EventCategoryInfo*/
    if (chapeldata.category) {
      this.ref = firebase
        .firestore()
        .collection("categories")
        .doc(this.state.category);
      this.ref.get().then(doc => {
        if (doc.data() !== undefined || doc.data().title !== undefined) {
          this.setSelectedCategory(doc.data().title);
        }
      });
    } else {
      this.setState({
        showCategory: "Yes"
      });
    }
    /*EventCategoryInfo]*/
  }
  setSelectedCategory(catname) {
    this.setState({
      selectedCategory: catname,
      showCategory: "Yes"
    });
  }
  updateInput = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  handleClick(itemselected) {
    this.setState({
      category: Object.keys(this.state.categorylist).find(
        key => this.state.categorylist[key] === itemselected
      )
    });
  }
  updateFormData = e => {
    e.preventDefault();
    const db = firebase.firestore();
    const updateRef = firebase
      .firestore()
      .collection("chapels")
      .doc(this.state.key);
    updateRef
      .set({
        title: this.state.title,
        category: this.state.category,
        avatar: this.state.avatar,
        audio: this.state.audioURL,
        status: true,
tag:this.state.tag,
        description: this.state.description
      })
      .then(docRef => {
        this.setState({
          title: "",
          category: "",
          avatar: "",
tag:"",
          audioURL: "",
          audio: "",
          description: "",
          userresult: true
        });
        this.props.history.push("/chapels");
      })
      .catch(error => {
        console.error("Error adding document: ", error);
      });
  };

  //Photo Upload starts
  handleUploadStart = () => this.setState({ isUploading: true, progress: 0 });
  handleProgress = progress => this.setState({ progress });
  handleUploadError = error => {
    this.setState({ isUploading: false });
    console.error(error);
  };
  handleUploadSuccess = filename => {
    firebase
      .storage()
      .ref("images")
      .child(filename)
      .getDownloadURL()
      .then(url =>
        this.setState({
          avatarURL: url,
          avatar: url,
          progress: 100,
          isUploading: false
        })
      );
  };
  //Photo Upload Ends

  //Audio upload stars
  handleAudioUploadStart = () =>
    this.setState({ isUploadingAudio: true, audioprogress: 0 });
  handleAudioProgress = audioprogress => this.setState({ audioprogress });
  handleAudioUploadError = error => {
    this.setState({ isUploadingAudio: false });
    console.error(error);
  };
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
        {authUser => (
          <div>
            {this.state.userresult ? (
              <div className="alert alert-success" role="alert">
                Chapel updated successfully!
              </div>
            ) : (
              ""
            )}

            <div className="panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title">EDIT CHAPEL</h3>
              </div>
              <div className="panel-body">
                <Link to={`/chapels`} className="">
                  Back
                </Link>
                <form className="well span10" onSubmit={this.updateFormData}>
                  <div className="row">
                    <div className="span3">
                      <label>Title</label>
                      <input
                        className="span3"
                        name="title"
                        placeholder="Title"
                        onChange={this.updateInput}
                        value={this.state.title}
                        type="text"
                      />
<label>Tag</label>
                      <input
                        className="span3"
                        name="tag"
                        placeholder="Tag"
                        onChange={this.updateInput}
                        value={this.state.tag}
                        type="text"
                      />

                      <label>Audio</label>
                      {this.state.isUploadingAudio && (
                        <p>Progress: {this.state.progress}</p>
                      )}
                      {this.state.audioURL && (
                        <p>
                          {" "}
                          <a href={this.state.audioURL}>Audio Uploaded</a>{" "}
                        </p>
                      )}

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
                      <br />
                      <br />
                      
                      <label>Image:</label>
                      {this.state.isUploading && (
                        <p>Progress: {this.state.progress}</p>
                      )}

                      {this.state.avatar && (
                        <img width="100" src={this.state.avatar} />
                      )}
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
                      <textarea
                        value={this.state.description}
                        className="input-xlarge span5"
                        id="description"
                        name="description"
                        onChange={this.updateInput}
                        rows="10"
                      />
                    </div>
                  </div>

                  <button className="btn btn-primary pull-right" type="submit">
                    Submit
                  </button>
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

export default withAuthorization(authCondition)(EditchapelPage);
