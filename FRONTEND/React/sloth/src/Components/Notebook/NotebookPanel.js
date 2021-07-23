import React, { Component } from "react";

import { Notebook } from "../../Models/notebook.js";

import RenderNotebooks from "./RenderNotebooks.js";
import NotebookView from "./NotebookView.js";
import CreateNotebookForm from "./CreateNotebookForm";
import NoteEditor from "./NoteEditor.js";
import SearchBox from "./../Cardset/SearchBox";

import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Col from "react-bootstrap/Col";

/**
 * KOMPONENTA NOTEBOOKPANEL:
 *
 * Komponenta za prikaz i interakciju sa beleškama.
 * Poziva se u SLOTHOVERLORD.
 * ---------------------------------------------------------------------------------------------------------------------
 * Props:
 *   - whose - koje notebooks renderuje (public/user/group)
 *   - user - this.props.user je objekat korisnika koji je ulogovan
 *   - group - ako je whose = group, prosleđen je objekat grupe
 *   - notebooks - ako je whose = public, onda je ovde prosleđen niz javnih notebooks
 * ---------------------------------------------------------------------------------------------------------------------
 * State:
 *   - view: panel/notebook/note
 *   - whose: da li su cardsetovi private, public ili group
 *   - action: view/edit/create
 *   - fetching: da li komponenta čeka na podatke iz baze
 *   - user: postoji ako su notebooks private ili group
 *   - group: postoji ako su notebooks group
 * ---------------------------------------------------------------------------------------------------------------------
 */

class NotebookPanel extends Component {
  constructor(props) {
    super(props);

    switch (props.whose) {
      case "public":
        this.state = {
          view: "panel",
          action: "browse",
          whose: props.whose,
          fetching: true,
          notebooks: [],
          filteredNotebooks: [],
        };
        break;
      case "user":
        this.state = {
          view: "panel",
          action: "browse",
          whose: props.whose,
          fetching: true,
          user: props.user,
          notebooks: [],
          filteredNotebooks: [],
        };
        break;
      case "group":
        this.state = {
          view: "panel",
          action: "browse",
          whose: props.whose,
          owner: props.owner,
          fetching: true,
          user: props.user,
          groupID: props.groupID,
          notebooks: [],
          filteredNotebooks: [],
        };
        break;
      default:
        this.state = {
          view: "error",
        };
    }

    this.enterPanel = this.enterPanel.bind(this);
    this.viewNotebook = this.viewNotebook.bind(this);
    this.viewNote = this.viewNote.bind(this);
    this.createNote = this.createNote.bind(this);
    this.editNote = this.editNote.bind(this);
    this.editNotebook = this.editNotebook.bind(this);
    this.setFilteredNotebooks = this.setFilteredNotebooks.bind(this);
    this.fromNoteEditorToNotebook = this.fromNoteEditorToNotebook.bind(this);
  }

  componentDidMount() {

    switch (this.state.whose) {
      case "public":
        this.fetchPublicNotebooks();
        break;

      case "user":
        this.fetchUserNotebooks();
        break;

      case "group":
        this.fetchGroupNotebooks();
        break;

      default:
    }
  }

  //#region State Changers
  enterPanel() {
    this.setState({
      view: "panel",
      action: "browse",
      name: "Notebook Panel",
    });
  }

  fromNoteEditorToNotebook() {
    this.setState({
      action: "browse",
      view: "notebook",
    })
  }

  viewNotebook(notebook) {
    this.setState({
      view: "notebook",
      action: "browse",
      name: notebook.title,
      notebook: notebook,
      note: null,
    });
  }

  viewNote(note) {
    this.setState({
      action: "browse",
      note: note,
    });
  };

  createNotebook() {
    this.setState({
      view: "panel",
      action: "create",
    });
  }

  createNote(notebook) {
    this.setState({
      view: "notebook",
      action: "create",
      name: notebook.title,
      notebook: notebook,
      note: null,
    });
  }

  editNotebook(notebook) {
    this.setState({
      view: "notebook",
      action: "edit",
      notebook: notebook,
    });
  }

  editNote = (note) => {
    this.setState({
      view: "note",
      action: "edit",
      note: note,
    });
  }

  setFilteredNotebooks(notebooks) {
    this.setState({
      filteredNotebooks: notebooks
    });
  }
  //#endregion

  //#region Fetches
  fetchUserNotebooks() {
    this.setState({
      fetching: true,
    });

    let notebooks = [];
    // fetch code
    fetch("https://localhost:5001/SLOTH/GetNotebooks/" + this.props.user.id)
            .then(response => response.json())
            .then(data => {
              data.forEach(nb => {
                let notebook = new Notebook(nb.notebook.id, nb.notebook.title, nb.notebook.tags, nb.notebook.groupID, nb.notebook.grade);
                notebook.setVisibility(nb.notebook.visibility);
                notebook.setCategory(nb.notebook.category);
                notebooks.push(notebook);
              });
                this.setState({notebooks: notebooks, fetching: false, filteredNotebooks: notebooks});
            })
            .catch(e => {
                this.setState({...this.state, fetching: false}); // nzm šta znači ova linija
            });
  }

  fetchPublicNotebooks() {
    this.setState({
      fetching: true,
    });

    let notebooks = [];
    // fetch code
    fetch("https://localhost:5001/SLOTH/GetPublicNotebooks")
            .then(response => response.json())
            .then(data => {
              data.forEach(nb => {
                let notebook = new Notebook(nb.id, nb.title, nb.tags, nb.groupID, nb.grade);
                notebook.setVisibility(nb.visibility);
                notebook.setCategory(nb.category);
                notebooks.push(notebook);
              });
                this.setState({notebooks: notebooks, filteredNotebooks: notebooks, fetching: false});

            })
            .catch(e => {
                this.setState({...this.state, fetching: false}); // nzm šta znači ova linija
            });
  }

  fetchGroupNotebooks() {
    this.setState({
      fetching: true,
    });

    let notebooks = [];

    if(this.props.toFetch === "group") {
      fetch("https://localhost:5001/SLOTH/GetGroupNotebooks/" + this.props.groupID)
            .then((response) => response.json())
            .then((data) => {
                data.forEach((d) => {
                    let nb = new Notebook(d.id, d.title, d.tags, d.groupID, d.grade);
                    nb.setVisibility(d.visibility);
                    nb.setCategory(d.category);
                    notebooks.push(nb);
                });
                this.setState({ notebooks: notebooks, fetching: false , filteredNotebooks: notebooks });
            })
            .catch((e) => {
                this.setState({ ...this.state, fetching: false });
            });
    }
    else if(this.props.toFetch === "user") {
      fetch("https://localhost:5001/SLOTH/GetUsersGroupNotebooks/" + this.state.groupID +"/"+ this.state.user.id)
      .then((response) => response.json())
      .then((data) => {
        data.forEach((d) => {
          let nb = new Notebook(
            d.notebook.id,
            d.notebook.title,
            d.notebook.tags, 
            d.notebook.groupID,
            d.notebook.grade
          );
          nb.setVisibility(d.notebook.visibility);
          nb.setCategory(d.notebook.category);
          notebooks.push(nb);
        });
        this.setState({ notebooks: notebooks, fetching: false , filteredNotebooks: notebooks });
      })
      .catch((e) => {
        this.setState({ ...this.state, fetching: false });
      });
    }

    this.setState({fetching: false});
  }
  //#endregion

  //#region Updaters
  updateWhoseChanged(prevProps, prevState) {
    switch (this.props.whose) {
      case "public":
        this.setState({
          view: "panel",
          action: prevState.action,
          whose: this.props.whose,
          fetching: true,
          notebooks: [],
          filteredNotebooks: [],
        });
        this.fetchPublicNotebooks();
        break;
      case "user":
        this.setState({
          view: "panel",
          action: prevState.action,
          whose: this.props.whose,
          fetching: true,
          user: this.props.user,
          notebooks: [],
          filteredNotebooks: [],
        });
        this.fetchUserNotebooks();
        break;
      case "group":
        this.setState({
          view: "panel",
          action: prevState.action,
          whose: this.props.whose,
          owner: this.props.owner,
          fetching: true,
          user: this.props.user,
          group: this.props.group,
          notebooks: [],
          filteredNotebooks: [],
        });
        this.fetchGroupNotebooks();
        break;
      default:
        this.setState({
          view: "error",
        });
    }
  }

  updateActionChanged(prevProps, prevState) {
    if (this.state.action === "browse") {
      let view = prevState.view;
      if(prevState.view === "note") {
        view = "notebook";
      }
      switch (this.props.whose) {
        case "public":
          this.setState({
            view: view,
            action: "browse",
            whose: this.props.whose,
            fetching: true,
            notebooks: [],
            filteredNotebooks: [],
          });
          this.fetchPublicNotebooks();
          break;
        case "user":
          this.setState({
            view: view,
            action: "browse",
            whose: this.props.whose,
            fetching: true,
            user: this.props.user,
            notebooks: [],
            filteredNotebooks: [],
          });
          this.fetchUserNotebooks();
          break;
        case "group":
          this.setState({
            view: view,
            action: "browse",
            whose: this.props.whose,
            owner: this.props.owner,
            fetching: true,
            user: this.props.user,
            group: this.props.group,
            notebooks: [],
            filteredNotebooks: [],
          });
          this.fetchGroupNotebooks();
          break;
        default:
          this.setState({
            view: "error",
          });
      }
    }
  }

  updateViewChanged(prevProps, prevState) {
    if (this.state.view === "panel") {
      switch (this.props.whose) {
        case "public":
          this.setState({
            view: "panel",
            action: prevState.action,
            whose: this.props.whose,
            fetching: true,
            notebooks: [],
            filteredNotebooks: [],
          });
          this.fetchPublicNotebooks();
          break;
        case "user":
          this.setState({
            view: "panel",
            action: prevState.action,
            whose: this.props.whose,
            fetching: true,
            user: this.props.user,
            notebooks: [],
            filteredNotebooks: [],
          });
          this.fetchUserNotebooks();
          break;
        case "group":
          this.setState({
            view: "panel",
            action: prevState.action,
            whose: this.props.whose,
            owner: this.props.owner,
            fetching: true,
            user: this.props.user,
            group: this.props.group,
            notebooks: [],
            filteredNotebooks: [],
          });
          this.fetchGroupNotebooks();
          break;
        default:
          this.setState({
            view: "error",
          });
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.whose != this.props.whose) {
      this.updateWhoseChanged(prevProps, prevState);
    } else if (prevState.action != this.state.action) {
      this.updateActionChanged(prevProps, prevState);
    } else if (prevState.view !== this.state.view) {
      this.updateViewChanged(prevProps, prevState);
    }
  }
  //#endregion

  //#region Event Handlers
  createNotebookHandler = (event) => {
    event.preventDefault();
    this.createNotebook();
  };

  editNotebookHandler = (event) => {
    event.preventDefault();
    this.editNotebook();
  }

  editNoteHandler = (event) => {
    event.preventDefault();
    this.editNote();
  }
  //#endregion

  //#region Renders
  renderPanel() {
    if (this.state.fetching) {
      return (<Spinner animation="border" role="status">
      <span className="sr-only">Loading...</span>
    </Spinner>);
    }

    if (this.state.notebooks.length > 0) {
      let btnCreate = <div></div>;
      if (this.state.whose === "user" || this.props.owner) {
        btnCreate = (
          <Button variant="outline-dark" onClick={this.createNotebookHandler}>
            Create New Notebook
          </Button>
        );
      }
      return (
        <React.Fragment>
          <h1 className="display-3">Notebooks</h1>
          {btnCreate}
          <SearchBox array={this.state.notebooks} type="material" sendResults={this.setFilteredNotebooks}></SearchBox>
          <Col md={{ span: 4, offset: 4 }}>
          <RenderNotebooks
            openNotebook={this.viewNotebook}
            notebooks={this.state.filteredNotebooks}
          />
          </Col>
        </React.Fragment>
      );
    } else {
      if (this.state.whose === "group" && this.props.toFetch === "user" && !this.state.owner) {
        return <h6 style={{color:"#8300a3"}}>This user has no notebooks.</h6>
      }
      if (this.state.whose === "group" && this.props.toFetch === "group") {
        return <h6 style={{color:"#8300a3"}}>This group has no notebooks.</h6>
      }

      let btnCreate = (
        <div className="container">
          You can make your own notebook by logging in and navigating to{" "}
          <b>My Notebooks</b> page.
        </div>
      );
      if (this.state.whose === "user" || this.props.owner) {
        btnCreate = (
          <Button variant="outline-dark" onClick={this.createNotebookHandler}>
            Create New Notebook
          </Button>
        );
      }
      return (
        <React.Fragment>
          <h2>There are no notebooks available. You can maybe make your own?</h2>
          {btnCreate}
        </React.Fragment>
      );
    }
  }

  renderNotebook() {
    return (
      <NotebookView
        whose={this.state.whose}
        owner={this.props.owner}
        notebook={this.state.notebook}
        note={this.state.note}
        enterPanel={this.enterPanel}
        createNote={this.createNote}
        editNotebook={this.editNotebook}
        editNote={this.editNote}
        viewNote={this.viewNote}
        teacher={this.props.teacher}
      ></NotebookView>
    );
  }

  renderCreateNotebook() {
    return (
      <CreateNotebookForm
      userID={this.state.user.id}
      groupID={this.props.groupID}
        enterPanel={this.enterPanel}
        createNote={this.createNote}
        action="create"
        whose={this.state.whose}
      ></CreateNotebookForm>
    );
  }

  renderCreateNote() {
    return (
      <NoteEditor
        action="create" 
        notebook={this.state.notebook}
        enterPanel={this.enterPanel}
        viewNotebook={this.fromNoteEditorToNotebook}
      ></NoteEditor>
    );
  }

  renderEditNotebook() {
    return (
      <CreateNotebookForm
        userID={this.state.user.id}
        enterPanel={this.enterPanel}
        viewNotebook={this.viewNotebook}
        action="edit"
        notebook={this.state.notebook}
      ></CreateNotebookForm>
    );
  }

  renderEditNote() {
    return (
      <NoteEditor
        action="edit" 
        notebook={this.state.notebook}
        note={this.state.note}
        enterPanel={this.enterPanel}
        viewNotebook={this.fromNoteEditorToNotebook}
      ></NoteEditor>
    );
  }

  renderBrowse() {
    if (this.state.view == "panel") {
      return this.renderPanel();
    } else if (this.state.view == "notebook") {
      return this.renderNotebook();
    } else {
      return <h4>renderBrowse Error: this.state.view is invalid.</h4>;
    }
  }

  renderCreate() {
    if (this.state.view == "panel") {
      return this.renderCreateNotebook();
    } else if (this.state.view == "notebook") {
      return this.renderCreateNote();
    } else {
      return <h4>renderCreate Error: this.state.view is invalid.</h4>;
    }
  }

  renderEdit() {
    if (this.state.view == "notebook") {
      return this.renderEditNotebook();
    } else if (this.state.view == "note") {
      return this.renderEditNote();
    } else {
      return <h4>renderEdit Error: this.state.view is invalid.</h4>;
    }
  }
  //#endregion

  render() {

    let btnBack = null;
      if(this.props.whose === "group") {
        btnBack = <Button variant="secondary" onClick={() => this.props.changeShowing("main")}>Back to Group</Button>
      }

    if (this.state.fetching) {
      return (<Spinner animation="border" role="status">
      <span className="sr-only">Loading...</span>
    </Spinner>);
    } else {
      let element;

      switch (this.state.action) {
        case "browse":
          element = this.renderBrowse();
          break;

        case "create":
          element = this.renderCreate();
          break;

        case "edit":
          element = this.renderEdit();
          break;

        default:
          element = <div>Error: this.state.view is not valid.</div>;
          break;
      }

      return (
        <React.Fragment>
          {btnBack}
          {element}
        </React.Fragment>
      );
    }
  }
  
}

export default NotebookPanel;
