import React, { Component } from "react";
import AdminCardsetsPanel from "./AdminCardsetsPanel.js";
import AdminNotebooksPanel from "./AdminNotebooksPanel.js";
import SearchBox from "../Cardset/SearchBox.js";
import NewAdminForm from "./NewAdminForm.js";
import { User } from "../../Models/user.js";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

class AdminUsersPanel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            view: "default",
            action: "browse",
            users: [],
            filteredUsers: [],
            fetching: true,
            count: ""
        };

        this.setStateAction = this.setStateAction.bind(this);
        this.setFilteredUsers = this.setFilteredUsers.bind(this);
    }
    //#region  StateSetting
    setStateAction(clicked) {
        switch(clicked)
        {
            case "create":
                this.setState({action: "create"});
                break;
            case "edit":
                this.setState({action: "edit"});
                break;
            case "viewCardSets":
                this.setState({action: "viewCardSets"});
                break;
            case "viewNotebooks":
                this.setState({action: "viewNotebooks"});
                break;
            default:
                this.setState({action: "browseAfter"});
                this.fetchUsers();
                break;
        }
    }

    setFilteredUsers(users) {
        this.setState({filteredUsers: users})
    }
    //#endregion

    //#region FetchFuntions
    fetchUsers() {
        this.setState({fetching:true});
        let users = [];
        fetch("https://localhost:5001/SLOTH/GetAllUsers")
            .then(response => response.json())
            .then(data => {
                data.forEach(u => {
                    let user = new User(u.id, u.username, u.password, u.tag, u.firstName, u.lastName, u.avatar, u.calendar, u.isAdmin);
                    users.push(user);
                });
                this.setState({users: users, fetching: false, filteredUsers: users, count: users.length});
            })
            .catch(e => {
                this.setState({...this.state, fetching: false});
            })
    }
    //#endregion
    
    componentDidMount() {
        this.fetchUsers();
    }

    //#region Functions
    openFormForCreate() {
        return <NewAdminForm setStateAction = {this.setStateAction}
                             action="newUser">
               </NewAdminForm>
    }

    openFormForEdit() {
        return <NewAdminForm setStateAction = {this.setStateAction}
                             action="edit"
                             userfirstname = {this.state.users[this.state.index].firstName}
                             userlastname = {this.state.users[this.state.index].lastName}
                             userid = {this.state.users[this.state.index].id}>
               </NewAdminForm>
    }

    openCardSets() {
        return <AdminCardsetsPanel setStateAction = {this.setStateAction}
                                   userid = {this.state.users[this.state.index].id}
                                   action="forUser">   
                </AdminCardsetsPanel>
    }

    openNotebooks() {
        return <AdminNotebooksPanel setStateAction = {this.setStateAction}
                                    userid = {this.state.users[this.state.index].id}
                                    action="forUser">   
                </AdminNotebooksPanel>
    }

    viewSelectedCardSets(index) {
        this.setStateAction("viewCardSets");
        this.setState({index: index});
    }

    viewSelectedNotebooks(index) {
        this.setStateAction("viewNotebooks");
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
                    fetch("https://localhost:5001/SLOTH/DeleteUser/" + this.state.users[index].id, requestOptions)
                        .then(response => {
                            if(response.ok) {
                                this.fetchUsers();
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
        let forHeader = Object.keys(this.state.users[0]).filter(key => key !== "events" && key !== "password" 
                                                                        && key !== "cardSet" && key !== "notebook"
                                                                        && key !== "groups" && key !== "studyPlans"
                                                                        && key !== "isAdmin");
        let header = forHeader;
        return header.map((key, index) => {
            if (key.toUpperCase() === "ID") 
                return <th key = {index} style={{backgroundColor:"#a0a6b0"}}>{key.toUpperCase()}</th>
            else
                return <th key = {index}>{key.toUpperCase()}</th>
        })
    }

    renderTableData() {
        return this.state.filteredUsers.map((user, index) => {
            const {id, username, tag, firstName, lastName, avatar} = user;
            return (
                <tr>
                    <td style={{backgroundColor:"#a0a6b0"}}>{id}</td>
                    <td>{username}</td>
                    <td>{tag}</td>
                    <td>{firstName}</td>
                    <td>{lastName}</td>
                    <td>{avatar}</td>
                    <td><Button variant="primary" onClick={() => this.viewSelectedCardSets(index)}>Cardsets</Button></td>
                    <td><Button variant="primary" onClick={() => this.viewSelectedNotebooks(index)}>Notebooks</Button></td>
                    <td><Button variant="primary" onClick={() => this.editSelected(index)}>Edit</Button></td>
                    <td><Button variant="danger" onClick={() => this.deleteSelected(index)}>Delete</Button></td>
                </tr>
            )
        })
    }

    renderBrowse() {
        let element;
        if (this.state.fetching) {
            element = <h3>We are getting users ready wait a bit</h3>;
        }
        else
        {
            if(this.state.users.length === 0)
            {
                element = 
                <div>
                    <div>
                        <h3>Users not found in the database. Why not create one?</h3> 
                        <Button variant="primary" onClick={() => this.setStateAction("create")}>Create User</Button>
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
                    <h3>All Users in database</h3>
                    <h5>Currently count of Users in database is: {this.state.count}</h5>
                    <h5>To Filter Data use SearchBox</h5>
                    <SearchBox array={this.state.users} type="users" sendResults={this.setFilteredUsers}></SearchBox>
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
                        <h4>To create new User select Create option</h4>
                        <Button variant="primary" onClick={() => this.setStateAction("create")}>Create User</Button>
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
        case "viewCardSets":
            element = this.openCardSets();
            break;
        case "viewNotebooks":
            element = this.openNotebooks();
            break;
        default:
            element = <div>Error: this.state.view is not valid.</div>;
            break;
        }
    
        return element;
    }
    //#endregion
}

export default AdminUsersPanel;