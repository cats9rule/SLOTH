import React, { Component } from "react";

import NotebookInfo from "./NotebookInfo";
import CreateNotebookForm from "./CreateNotebookForm";
import NoteEditor from "./NoteEditor";
import NoteView from "./NoteView";
import RenderNotes from "./RenderNotes";
import Grade from "../Cardset/Grade"

import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Spinner from "react-bootstrap/Spinner";
import ListGroup from "react-bootstrap/ListGroup";
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import AddIcon from '@material-ui/icons/Add';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import "../../styles/global.css";
import "../../styles/materialview.css";

import { Note } from "../../Models/note";

class NotebookView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      whose: props.whose,
      notebook: props.notebook,
      notes: [],
      currentNote: props.note,
      editingNote: false,
      fetching: true,
    };

    this.editNote = this.editNote.bind(this);
    this.viewNote = this.viewNote.bind(this);
    this.viewNotebook = this.viewNotebook.bind(this);
  }

  componentDidMount() {
    this.fetchGetNotes();
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.props.notebook != this.state.notebook) {
      this.setState({
        currentNote: null,
      });
    }
  }

  //#region State Changers
  viewNotebook = (notebook) => {
    this.setState({
      action: "browse",
      editingNote: false,
      notebook: notebook,
    });
  };

  viewNote = (note) => {
    this.props.viewNote(note);
    this.setState({
      action: "browse",
      currentNote: note,
    });
  };

  createNote = () => {
    this.setState({
      action: "create",
    });
  };

  editNote = (note) => {
    this.setState({
      editingNote: true,
      currentNote: note,
    });
  };
  //#endregion

  //#region Fetches
  fetchGetNotes() {
    this.setState({
      fetching: true,
    });

    let notes = [];

    fetch("https://localhost:5001/SLOTH/GetNotes/" + this.state.notebook.id)
      .then((response) => response.json())
      .then((data) => {
        data.forEach((d) => {
          let note = new Note(d.id, d.title, d.text);
          notes.push(note);
        });
        this.setState({ notes: notes, fetching: false });
      })
      .catch((e) => {
        this.setState({ ...this.state, fetching: false });
      });
  }

  fetchDeleteNotebook() {
    const requestOptions = {
      method: "Delete",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(),
    };

    confirmAlert({
      title: 'Confirm to delete',
      message: 'You sure you want to delete?',
      buttons: [
        {
          label: 'Yup',
          onClick: async () => {
            fetch(
              "https://localhost:5001/SLOTH/DeleteNotebook/" + this.state.notebook.id,
              requestOptions
            ).then((response) => {
              if (response.ok) {
                this.props.enterPanel();
              } else {
              }
            });
              }
        },
        {
          label: 'Nope'
        }
      ]
    });
  }

  fetchDeleteNote() {
    const requestOptions = {
      method: "Delete",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(),
    };

    confirmAlert({
      title: 'Confirm to delete',
      message: 'You sure you want to delete?',
      buttons: [
        {
          label: 'Yup',
          onClick: async () => {
            fetch(
              "https://localhost:5001/SLOTH/DeleteNote/" + this.state.currentNote.id,
              requestOptions
            ).then((response) => {
              if (response.ok) {
                let notes = this.state.notes;
                notes = notes.filter( n => {
                  if(n.id !== this.state.currentNote.id){
                    return n;
                  }
                })
                this.setState({
                  currentNote: null,
                  notes: notes,
                });
              } else {
              }
            });
              }
        },
        {
          label: 'Nope'
        }
      ]
    });
  }
  //#endregion

  componentDidUpdate(prevProps) {
    if (prevProps.notebook !== this.props.notebook) {
      this.setState({ notebook: this.props.notebook, noOfNotes: 0 });
    }
  }

  //#region Event Handlers
  deleteNotebook = (event) => {
    event.preventDefault();
    this.fetchDeleteNotebook();
  };
  deleteNote = (event) => {
    event.preventDefault();
    this.fetchDeleteNote();
  }
  //#endregion

  //#region Renders
  renderViewUser() {
    if (this.state.fetching) {
      return (
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      );
    }
      let gradeComp = null;
      console.log("grade")
      if(this.props.whose === "group")
      {
        
        let who;
        if(this.props.teacher)
          who = "teacher";
        else
          who = "student"
        gradeComp = <Grade type = "notebook"
                           who = {who}
                           notebook={this.state.notebook}></Grade>
      }
      let btnDelete = null;
      if(this.state.currentNote !== null) {
        btnDelete = <Button className="d-flex align-items-center" variant="danger" onClick={this.deleteNote}><DeleteIcon></DeleteIcon>Delete Note</Button>
      }
    return (
      <div className="container-fluid flex-row">
        <div className="col-3 flex-column infobox">
          <IconButton variant="secondary" onClick={this.props.enterPanel}>
            <ArrowBackIcon></ArrowBackIcon>
          </IconButton>
          <div className="container-fluid flex-row justify-content-end">
            <ButtonGroup size="sm">
              <IconButton
                variant="primary"
                onClick={() => this.props.editNotebook(this.state.notebook)}
              >
                <EditOutlinedIcon color="primary"></EditOutlinedIcon>
              </IconButton>
              <IconButton variant="danger" onClick={this.deleteNotebook}>
                <DeleteIcon style={{color: "#ff0000"}}></DeleteIcon>
              </IconButton>
            </ButtonGroup>
          </div>
          {gradeComp}
          <NotebookInfo notebook={this.state.notebook} notes={this.state.notes}/>
          <h5>Notes: </h5>
          <RenderNotes notes={this.state.notes} viewNote={this.viewNote}></RenderNotes>
        </div>
        <div className="col-9">
          <div className="container-fluid flex-align-left">
            <Button
              className="d-flex align-items-center"
              variant="success"
              onClick={() => this.props.createNote(this.state.notebook)}
            >
              <AddIcon></AddIcon>New note
            </Button>
            {btnDelete}
          </div>
          <div className="">
            <NoteView
              editNote={this.props.editNote}
              viewNotebook={this.viewNotebook}
              note={this.state.currentNote}
            />
          </div>
        </div>
      </div>
    );
  }

  renderViewPublic() {
    if (this.state.fetching) {
      return (
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      );
    }
    let notes = null;
    if (this.state.notes.length == 0) {
      notes = <p>This notebook has no notes.</p>;
    } else
      notes = this.state.notes.map((n) => {
        return (
          <Button variant="light" onClick={() => this.openNote(n)}>
            {n.title}
          </Button>
        );
      });
	  let gradeComp = null;
      if(this.props.whose === "group")
      {
        let who;
        if(this.props.teacher)
          who = "teacher";
        else
          who = "student"
        gradeComp = <Grade type = "notebook"
                           who = {who}
                           notebook={this.state.notebook}>
                           </Grade>
      }

      let currNote = null;
      if(this.state.currentNote != null) {
        currNote = (<div dangerouslySetInnerHTML={{__html: this.state.currentNote.text}}></div>);
      }

    return (
      <div className="container-fluid flex-row">
        <div className="col-3 flex-column infobox">
          <div className="container-fluid flex-row">
            <IconButton variant="primary" onClick={this.props.enterPanel}>
              <ArrowBackIcon></ArrowBackIcon>
            </IconButton>
          </div>
		  {gradeComp}
          <NotebookInfo notebook={this.state.notebook} notes={this.state.notes}/>
          <RenderNotes notes={this.state.notes} viewNote={this.viewNote}></RenderNotes>
        </div>
        <div className="col-6">
          <div className="card-space">
          {currNote}
          </div>
        </div>
      </div>
    );
  }

  renderEditNote() {
    return (
      <div className="container-fluid flex-row">
        <div className="col-3 flex-column infobox">
          <div className="container-fluid flex-row">
            <IconButton
              variant="primary"
              onClick={() => this.props.editNotebook(this.state.notebook)}
            >
              <EditOutlinedIcon color="primary"></EditOutlinedIcon>
            </IconButton>
            <IconButton variant="danger" onClick={this.deleteNotebook}>
              <DeleteIcon style={{color: "#ff0000"}}></DeleteIcon>
            </IconButton>
          </div>
          <NotebookInfo
            notebook={this.state.notebook}
            noOfNotes={this.state.noOfNotes}
            notes = {this.state.notes}
          />
        </div>
        <div className="col-9">
          <CreateNotebookForm
            action="edit"
            notebook={this.state.notebook}
          ></CreateNotebookForm>

          <Button variant="primary" onClick={this.props.enterPanel}>
            Close Notebook
          </Button>
        </div>
      </div>
    );
  }

  render() {
    console.log("NB View rendering.");
    if (this.state.fetching) {
      return (
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      );
    } else if (this.props.whose === "group") {

      if(this.props.owner) {
        return this.renderViewUser();
      }
      else {
        return this.renderViewPublic();
      }

    } else {
      if (this.state.whose === "user") {
        return this.renderViewUser();
      } else if (this.state.whose === "public") {
        return this.renderViewPublic();
      }
    }
  }
  //#endregion
}

export default NotebookView;
