import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import NoteForm from "./NoteForm";
import SearchBox from "../Cardset/SearchBox.js";
import { Note } from "../../Models/note";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

class AdminNotesPanel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            view: "default",
            action: "browse",
            notebookid: this.props.notebookid,
            notes: [],
            filteredNotes: [],
            fetching: true,
            count: ""
        };

        this.setStateAction = this.setStateAction.bind(this);
        this.setFilteredNotes = this.setFilteredNotes.bind(this);
    }

    //#region StateSetting
    setStateAction(clicked) {
        switch(clicked)
        {
            case "create":
                this.setState({action: "create"});
                break;
            case "edit":
                this.setState({action: "edit"});
                break;
            default:
                this.setState({action: "browse"});
                this.fetchNotes();
                break;
        }
    }

    setFilteredNotes(notes) {
        this.setState({filteredNotes: notes})
    }
    //#endregion

    //#region FetchFunction
    fetchNotes() {
        this.setState({fetching:true});
        let notes = [];
        fetch("https://localhost:5001/SLOTH/GetNotes/" + this.state.notebookid)
            .then(response => response.json())
            .then(data => {
                data.forEach(n => {
                    let note = new Note(n.id, n.title, n.text);
                    notes.push(note);
                });
                this.setState({notes:notes, fetching: false, filteredNotes: notes, count: notes.length});
            })
            .catch(e => {
                this.setState({...this.state, fetching: false});
            })
    }
    //#endregion

    componentDidMount() {
        this.fetchNotes();
    }

    //#region Functions
    openFormForCreate() {
        return <NoteForm setStateAction = {this.setStateAction}
                         action="create"
                         notebookid = {this.state.notebookid}>
                </NoteForm>
    }

    openFormForEdit() {
        return <NoteForm setStateAction = {this.setStateAction}
                         action="edit"
                         note = {this.state.notes[this.state.index]}>
                </NoteForm>
    }

    editSelected(index) {
        this.setStateAction("edit");
        this.setState({index: index});
    }

    deleteSelected(index) {
        this.setState({index: index});
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
                    fetch("https://localhost:5001/SLOTH/DeleteNote/" + this.state.notes[index].id, requestOptions)
                        .then(response => {
                            if(response.ok) {
                                this.fetchNotes();
                            }  
                    })
                }
              },
              {
                label: 'Nope'
              }
            ]
          });
    }
    //#endregion

    //#region RenderFunctions
    renderTableHeader() {
        let header = Object.keys(this.state.notes[0]);
        return header.map((key, index) => {
            if (key.toUpperCase() === "ID") 
                return <th key = {index} style={{backgroundColor:"#a0a6b0"}}>{key.toUpperCase()}</th>
            else
                return <th key = {index}>{key.toUpperCase()}</th>
        })
    }

    renderTableData() {
        return this.state.filteredNotes.map((card, index) => {
            const {id, title, text} = card;
            return (
                <tr>
                    <td style={{backgroundColor:"#a0a6b0"}}>{id}</td>
                    <td>{title}</td>
                    <td>{text}</td>
                    <td>{this.state.notebookid}</td>
                    <td><Button variant="primary" onClick={() => this.editSelected(index)}>Edit</Button></td>
                    <td><Button variant="danger" onClick={() => this.deleteSelected(index)}>Delete</Button></td>
                </tr>
            )
        })
    }

    renderBrowse() {
        let element;
        if (this.state.fetching) {
            element = <h3>We are getting notes ready wait a bit</h3>;
        }
        else
        {
            if(this.state.notes.length === 0)
            {
                element = 
                <div>
                    <div>
                        <h3>Chosen Notebook does not have notes. Why not create one?</h3> 
                        <Button variant="primary" onClick={() => this.setStateAction("create")}>Create Note</Button>
                    </div>
                    <div>
                        <h3>To go back to Admin Notebooks Panel select Go Back option</h3>
                        <Button variant="primary" onClick={this.props.setStateAction}>Go back</Button>
                    </div>
                </div>
            }
            else
            {
                element = 
                <div>
                    <h3>All Notes for selected Notebook</h3>
                    <h5>Currently count of Notes in database for Selected Notebooks is: {this.state.count}</h5>
                    <h5>To Filter Data use SearchBox</h5>
                    <SearchBox array={this.state.notes} type="notes" sendResults={this.setFilteredNotes}></SearchBox>
                    <Table striped bordered hover size="sm" responsive="md" id = "mmessages">
                        <tbody>
                            <tr>
                               {this.renderTableHeader()}
                               <th key = "notebookid">Notebook ID</th>
                               <th key = "options" colSpan="3">Options</th>
                            </tr>
                            {this.renderTableData()}
                        </tbody>
                    </Table>
                    <div align="left">
                        <h4>To create new Note select Create option</h4>
                        <Button variant="primary" onClick={() => this.setStateAction("create")}>Create Note</Button>
                    </div>
                    <div align="left">
                        <h4>To go back to Admin Notebooks Panel select Go Back option</h4>
                        <Button variant="primary" onClick={this.props.setStateAction}>Go back</Button>
                    </div>
                </div>
            }
        }
        return element;
    }

    render() {
        let element;
        switch(this.state.action) {
        case "browse":  
            element = this.renderBrowse();
            break;
        case "edit":
            element = this.openFormForEdit();
            break;
        case "create":
            element = this.openFormForCreate();
            break;
        default:
            element = <div>Error: this.state.view is not valid.</div>;
            break;
        }
    
        return element;
    }
    //#endregion
}

export default AdminNotesPanel;
