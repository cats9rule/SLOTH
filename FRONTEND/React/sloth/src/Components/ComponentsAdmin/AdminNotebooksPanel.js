import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import AdminNotesPanel from "./AdminNotesPanel.js";
import NotebookForm from "./NotebookForm.js";
import SearchBox from "../Cardset/SearchBox.js";
import { Notebook } from "../../Models/notebook.js";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

class AdminNotebooksPanel extends Component {
    constructor(props) {
        super(props);
        if(this.props.action === "forUser") {
            this.state = {
                view: "default",
                action: "forUser",
                forUser: true,
                forGroup: false,
                userid: this.props.userid,
                notebooks: [],
                filteredNotebooks: [],
                fetching: true
            };
        }
        else if (this.props.action === "forGroup") {
            this.state = {
                view: "default",
                action: "forGroup",
                forUser: false,
                forGroup: true,
                userid: this.props.groupid,
                notebooks: [],
                filteredNotebooks: [],
                fetching: true
            };
        }
        else {
            this.state = {
                view: "default",
                action: "browse",
                userid: "",
                forUser: false,
                forGroup: false,
                notebooks: [],
                filteredNotebooks: [],
                fetching: true,
                count: ""
            };
        }

        this.setStateAction = this.setStateAction.bind(this);
        this.setFilteredNotebooks = this.setFilteredNotebooks.bind(this);
    }

    //#region StateSetting
    setStateAction(clicked) {
        switch(clicked)
        {
            case "create":
                this.setState({action: "create", forUser: false});
                break;
            case "edit":
                this.setState({action: "edit"});
                break;
            case "view":
                this.setState({action: "view"});
                break;
            case "forUser":
                this.setState({action: "forUser", forUser: true, forGroup:false,});
                this.fetchUserCardSets();
                break;
            case "forGroup":
                this.setState({action: "forUser", forUser: false, forGroup:true});
                this.fetchGroupNotebooks();
                break;
            case "forUserCreate":
                this.setState({action: "create", forUser: true, forGroup:false, userid: this.props.userid});
                break;
            case "forGroupCreate":
                this.setState({action: "create", forUser: false, forGroup: true, groupid: this.props.userid});
                break;
            default:
                if (this.state.forUser === false && this.state.forGroup === false)    
                {
                    this.setState({action: "browseAfter"});
                    this.fetchNotebooks();
                }
                else if (this.state.forUser === true && this.state.forGroup === false)    
                {
                    this.setState({action: "forUser"});
                    this.fetchUserNotebooks();
                }
                else if (this.state.forUser === false && this.state.forGroup === true)
                {
                    this.setState({action: "forGroup"});
                    this.fetchGroupNotebooks();
                }    
                break;
        }
    }

    setFilteredNotebooks(notebooks) {
        this.setState({filteredNotebooks: notebooks})
    }
    //#endregion

    //#region FetchFunctions
    fetchNotebooks() {
        this.setState({fetching:true});
        let notebooks = [];
        fetch("https://localhost:5001/SLOTH/GetAllNotebooks")
            .then(response => response.json())
            .then(data => {
                data.forEach(nb => {
                    let notebook = new Notebook(nb.id, nb.title, nb.tags);
                    notebook.setVisibility(nb.visibility);
                    notebook.setCategory(nb.category);
                    notebooks.push(notebook);
                });
                this.setState({notebooks: notebooks, fetching:false, filteredNotebooks: notebooks, count: notebooks.length});
            })
            .catch(e => {
                this.setState({...this.state, fetching:false});
            })
    }

    fetchUserNotebooks() {
        this.setState({fetching:true});
        let notebooks = [];
        fetch("https://localhost:5001/SLOTH/GetNotebooks/" + this.props.userid)
            .then(response => response.json())
            .then(data => {
                data.forEach(nb => {
                    let notebook = new Notebook(nb.notebook.id, nb.notebook.title, nb.notebook.tags);
                    notebook.setVisibility(nb.notebook.visibility);
                    notebook.setCategory(nb.notebook.category);
                    notebooks.push(notebook);
                });
                this.setState({notebooks: notebooks, fetching: false, filteredNotebooks: notebooks});
            })
            .catch(e => {
                this.setState({...this.state, fetching:false});
            })
    }

    fetchGroupNotebooks() {
        this.setState({fetching:true});
        let notebooks = [];
        fetch("https://localhost:5001/SLOTH/GetGroupNotebooks/" + this.props.groupid)
            .then(response => response.json())
            .then(data => {
                data.forEach(nb => {
                    let notebook = new Notebook(nb.id, nb.title, nb.tags);
                    notebook.setVisibility(nb.visibility);
                    notebook.setCategory(nb.category);
                    notebooks.push(notebook);
                });
                this.setState({notebooks: notebooks, fetching: false, filteredNotebooks: notebooks});
            })
            .catch(e => {
                this.setState({...this.state, fetching:false});
            })
    }
    //#endregion

    componentDidMount() {
        if(this.state.action !== "forUser" && this.state.action !== "forGroup")
            this.fetchNotebooks();
        else if (this.state.action === "forUser")
            this.fetchUserNotebooks();
        else
            this.fetchGroupNotebooks();
    }

    //#region Functions
    openFormForCreate() {
        return <NotebookForm setStateAction = {this.setStateAction}
                             action="create"
                             forUser = {this.state.forUser}
                             forGroup = {this.state.forGroup}
                             userid = {this.state.userid}
                             groupid = {this.props.groupid}>
                </NotebookForm>
    }

    openFormForEdit() {
        return <NotebookForm setStateAction = {this.setStateAction}
                             action = "edit"
                             notebook = {this.state.notebooks[this.state.index]}>
                </NotebookForm>
    }

    openNotes() {
        return <AdminNotesPanel setStateAction = {this.setStateAction}
                                notebookid = {this.state.notebooks[this.state.index].id}>
               </AdminNotesPanel>
    }

    viewSelected(index) {
        this.setStateAction("view");
        this.setState({index: index});
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
                    fetch("https://localhost:5001/SLOTH/DeleteNotebook/" + this.state.notebooks[index].id, requestOptions)
                .then(response => {
                        if(response.ok) {
                            if(this.state.action == "forGroup")
                                    this.fetchGroupNotebooks();
                                else if (this.state.action == "forUser")
                                    this.fetchUserNotebooks();
                                else
                                    this.fetchNotebooks();
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
        let header = Object.keys(this.state.notebooks[0]).filter(key => key !== "notes");
        return header.map((key, index) => {
            if (key.toUpperCase() === "ID") 
                return <th key = {index} style={{backgroundColor:"#a0a6b0"}}>{key.toUpperCase()}</th>
            else
                return <th key = {index}>{key.toUpperCase()}</th>
        })
    }

    renderTableData() {
        return this.state.filteredNotebooks.map((notebook, index) => {
            const {id, title, tags, category, visibility} = notebook;
            return (
                <tr>
                    <td style={{backgroundColor:"#a0a6b0"}}>{id}</td>
                    <td>{title}</td>
                    <td>{tags.toString()}</td>
                    <td>{category.value}</td>
                    <td>{visibility.value}</td>
                    <td><Button variant="primary" onClick={() => this.viewSelected(index)}>View Notes</Button></td>
                    <td><Button variant="primary" onClick={() => this.editSelected(index)}>Edit</Button></td>
                    <td><Button variant="danger" onClick={() => this.deleteSelected(index)}>Delete</Button></td>
                </tr>
            )
        })
    }

    renderBrowse() {
        let element;
        if (this.state.fetching) {
            element = <h3>We are getting notebooks ready wait a bit</h3>;
        }
        else
        {
            if(this.state.notebooks.length === 0)
            {
                element = 
                <div>
                    <div>
                        <h3>Notebooks not found in the database. Why not create one?</h3> 
                        <Button variant="primary" onClick={() => this.setStateAction("create")}>Create Notebooks</Button>
                    </div>
                    <div>
                        <h3>To go back to Main Admin Panel select Go Back option</h3>
                        <Button variant="primary" onClick={this.props.setStateView}>Go back</Button>
                    </div>
                </div>
            }
            else
            {
                element = 
                <div>
                    <h3>All Notebooks in database</h3>
                    <h5>Currently count of Notebooks in database is: {this.state.count}</h5>
                    <h5>To Filter Data use SearchBox</h5>
                    <SearchBox array={this.state.notebooks} type="material" sendResults={this.setFilteredNotebooks}></SearchBox>
                    <Table striped bordered hover size="sm" responsive="md" id = "mmessages">
                        <tbody>
                            <tr>
                               {this.renderTableHeader()}
                               <th key = "options" colSpan="3">Options</th>
                            </tr>
                            {this.renderTableData()}
                        </tbody>
                    </Table>
                    <div align="left">
                        <h4>To create new Notebook select Create option</h4>
                        <Button variant="primary" onClick={() => this.setStateAction("create")}>Create Notebook</Button>
                    </div>
                    <div align="left">
                        <h4>To go back to Main Admin Panel select Go Back option</h4>
                        <Button variant="primary" onClick={this.props.setStateView}>Go back</Button>
                    </div>
                </div>
            }
        }
        return element;
    }

    renderBrowseForUser() {
        let element;
        if (this.state.fetching) {
            element = <h3>We are getting notebooks ready wait a bit</h3>;
        }
        else
        {
            if(this.state.notebooks.length === 0)
            {
                element = 
                <div>
                    <div>
                        <h3>Notebooks not found for selected User. Why not create one?</h3> 
                        <Button variant="primary" onClick={() => this.setStateAction("forUserCreate")}>Create Notebooks</Button>
                    </div>
                    <div>
                        <h3>To go back to Main Admin Panel select Go Back option</h3>
                        <Button variant="primary" onClick={this.props.setStateAction}>Go back</Button>
                    </div>
                </div>
            }
            else
            {
                element = 
                <div>
                    <h3>All Notebooks for selected User</h3>
                    <h5>To Filter Data use SearchBox</h5>
                    <SearchBox array={this.state.notebooks} type="material" sendResults={this.setFilteredNotebooks}></SearchBox>
                    <Table striped bordered hover size="sm" responsive="md" id = "mmessages">
                        <tbody>
                            <tr>
                               {this.renderTableHeader()}
                               <th key = "options" colSpan="3">Options</th>
                            </tr>
                            {this.renderTableData()}
                        </tbody>
                    </Table>
                    <div align="left">
                        <h4>To create new Notebook select Create option</h4>
                        <Button variant="primary" onClick={() => this.setStateAction("forUserCreate")}>Create Notebook</Button>
                    </div>
                    <div align="left">
                        <h4>To go back to Main Panel select Go Back option</h4>
                        <Button variant="primary" onClick={this.props.setStateAction}>Go back</Button>
                    </div>
                </div>
            }
        }
        return element;
    }

    renderBrowseForGroup() {
        let element;
        if (this.state.fetching) {
            element = <h3>We are getting notebooks ready wait a bit</h3>;
        }
        else
        {
            if(this.state.notebooks.length === 0)
            {
                element = 
                <div>
                    <div>
                        <h3>Notebooks not found for selected Group. Why not create one?</h3> 
                        <Button variant="primary" onClick={() => this.setStateAction("forGroupCreate")}>Create Notebooks</Button>
                    </div>
                    <div>
                        <h3>To go back to Main Admin Panel select Go Back option</h3>
                        <Button variant="primary" onClick={this.props.setStateAction}>Go back</Button>
                    </div>
                </div>
            }
            else
            {
                element = 
                <div>
                    <h3>All Notebooks for selected User</h3>
                    <h5>To Filter Data use SearchBox</h5>
                    <SearchBox array={this.state.notebooks} type="material" sendResults={this.setFilteredNotebooks}></SearchBox>
                    <Table striped bordered hover size="sm" responsive="md" id = "mmessages">
                        <tbody>
                            <tr>
                               {this.renderTableHeader()}
                               <th key = "options" colSpan="3">Options</th>
                            </tr>
                            {this.renderTableData()}
                        </tbody>
                    </Table>
                    <div align="left">
                        <h4>To create new Notebook select Create option</h4>
                        <Button variant="primary" onClick={() => this.setStateAction("forGroupCreate")}>Create Notebook</Button>
                    </div>
                    <div align="left">
                        <h4>To go back to Main Panel select Go Back option</h4>
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
        case "browseAfter":
            element = this.renderBrowse();
            break;
        case "view":
            element = this.openNotes();
            break;
        case "forUser":
            element = this.renderBrowseForUser();
            break;
        case "forGroup":
            element = this.renderBrowseForGroup();
            break;
        default:
            element = <div>Error: this.state.action is not valid.</div>;
            break;
        }
    
        return element;
    }
    //#endregion
}

export default AdminNotebooksPanel;