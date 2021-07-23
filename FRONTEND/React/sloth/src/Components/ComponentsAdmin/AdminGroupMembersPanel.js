import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import SearchBox from "../Cardset/SearchBox.js";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import RenderUsers from "../Groups/RenderUsers.js";
import {User} from "../../Models/user.js";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

class AdminGroupMembersPanel extends Component {
    constructor(props) {
        super(props)
        this.state = {
            view: "default",
            action: "browse",
            members: [],
            filteredMembers: [],
            count:"",
            fetching: true,
            usersToAdd:[], //korisnici koji treba da se dodaju u grupu
            allUsers:[], //all users - fetchovani korisnici
            filteredUsers: [], //rezultat pretrage
        };
        this.teacher = null;

        this.setStateAction = this.setStateAction.bind(this);
        this.setFilteredUsers = this.setFilteredUsers.bind(this);
        this.selectUser = this.selectUser.bind(this);
        this.deselectUser = this.deselectUser.bind(this);
        this.setFilteredMembers = this.setFilteredMembers.bind(this);
    }

    //#region StateSetting
    setStateAction(clicked) {
        switch(clicked)
        {
            case "create":
                this.setState({action: "create"});
                break;
            default:
                this.setState({action: "browseAfter"});
                this.fetchMembers();
                break;
        }
    }

    setFilteredUsers(users){
        this.setState({filteredUsers: users});
    }

    setFilteredMembers(members) {
        this.setState({filteredMembers: members})
    }
    //#endregion

    //#region FetchFunctions
    fetchMembers() {
        this.setState({fetching:true});

        fetch("https://localhost:5001/SLOTH/GetMembers/" + this.props.group.id)
            .then(response => response.json())
            .then(data => {
                this.teacher = data.find((d) => d.id === this.props.group.teacherID);
                let mmbrs = data.filter((d) => d.id !== this.props.group.teacherID);
                this.setState({members: mmbrs, fetching: false, filteredMembers: mmbrs, count: mmbrs.length});
            })
            .catch(e =>{
                this.setState({...this.state, fetching: false});
            })
    }

    fetchAddMembers() {
        this.setState({fetching:true});
        let ids = [];
        this.state.usersToAdd.forEach(u => {
            ids.push(u.id);
        })

        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                ids: ids,
            }),
        };

        const fetchFunction = async() => {
            const response = await fetch("https://localhost:5001/SLOTH/AddMembers/" + this.props.group.id, 
                requestOptions);
                if(response.ok){
                    this.setStateAction();
                }
        }

        fetchFunction();
    }

    fetchAllUsers() {
        this.setState({fetching:true});
        let users = [];
        fetch("https://localhost:5001/SLOTH/GetAllUsers")
            .then((response) => response.json())
            .then((data) => {
                data.forEach((user) => {
                    let newUser = new User(user.id, user.username, null, user.tag,
                        user.firstName, user.lastName, null, null, false);

                        if(!users.includes(newUser))
                            users.push(user);
                });
                this.fetchMembers();
                
                this.setState({allUsers: users, fetching:false});
                
            })
            .catch((e) => {
                this.setState({...this.state, fetching:false});
            });
    }
    //#endregion

    componentDidMount() {
        //this.fetchMembers();
        this.fetchAllUsers();
    }

    //#region Functions
    deselectUser(user)
    {
        let allUsers = this.state.allUsers;
        if(!allUsers.includes(user))
            allUsers.push(user);

        let usersToAdd = this.state.usersToAdd.filter((u) => u !== user);
        this.setState({
            usersToAdd: usersToAdd,
            allUsers: allUsers,
        });
    }

    selectUser(user)
    {
        let allUsers = this.state.allUsers.filter((u) => u !== user);
        let filteredUsers = this.state.filteredUsers.filter((u) => u !== user);

        let usersToAdd = this.state.usersToAdd;
        if(!usersToAdd.includes(user))
            usersToAdd.push(user);

        this.setState({
            usersToAdd: usersToAdd,
            allUsers: allUsers,
            filteredUsers: filteredUsers,
        })
    }

    add = (event) => {
        event.preventDefault();

        this.fetchAddMembers();
    }

    openFormForCreate() {
        let element;
        if (this.state.fetching) {
            element = <h3>We are getting users ready wait a bit</h3>;
        }
        else
        {
            element =
            <div>
                <Form className="container" onSubmit={this.add}>
                    <Form.Group as = {Row}>
                        <RenderUsers users={this.state.usersToAdd} onClk={this.deselectUser}></RenderUsers>
                    </Form.Group>                   
                    
                    <Form.Group as={Row}>
                            <Form.Label column sm={2}>
                                Add users:
                            </Form.Label>   
                            <SearchBox array={this.state.allUsers} type="users" sendResults={this.setFilteredUsers}></SearchBox>                       
                    </Form.Group>

                    <Form.Group as = {Row}>
                            <RenderUsers users={this.state.filteredUsers} onClk={this.selectUser}></RenderUsers>
                    </Form.Group>

                    <Row>
                        <Button variant="success" type="submit">Add</Button>
                        <Button variant="danger" onClick={this.setStateAction}>Cancel</Button>
                    </Row>
                    
                </Form>
            </div>
        }
        return element
    }

    deleteSelected(index) {
        this.setState({index: index})
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
                    fetch("https://localhost:5001/SLOTH/RemoveMembers/" + this.props.group.id + "/" + this.state.members[index].id, requestOptions)
                        .then(response => {
                            if(response.ok) {
                                this.fetchMembers();
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
        let forHeader = Object.keys(this.state.members[0]).filter(key => key !== "events" && key !== "password" && key !== "salt"
                                                                        && key !== "cardSets" && key !== "notebooks"
                                                                        && key !== "groups" && key !== "studyPlans"
                                                                        && key !== "isAdmin" && key !== "avatar");
        let header = forHeader;
        return header.map((key, index) => {
            if (key.toUpperCase() === "ID") 
                return <th key = {index} style={{backgroundColor:"#a0a6b0"}}>{key.toUpperCase()}</th>
            else
                return <th key = {index}>{key.toUpperCase()}</th>
        })
    }

    renderTableData() {
        return this.state.filteredMembers.map((user, index) => {
            const {id, username, tag, firstName, lastName} = user;
            return (
                <tr>
                    <td style={{backgroundColor:"#a0a6b0"}}>{id}</td>
                    <td>{username}</td>
                    <td>{tag}</td>
                    <td>{firstName}</td>
                    <td>{lastName}</td>
                    <td>{this.props.group.id}</td>
                    <td><Button variant="danger" onClick={() => this.deleteSelected(index)}>Remove</Button></td>
                </tr>
            )
        })
    } 

    renderBrowse() {
        let element;
        if (this.state.fetching) {
            element = <h3>We are getting members ready wait a bit</h3>;
        }
        else
        {
            if(this.state.members.length === 0)
            {
                element = 
                <div>
                    <div>
                        <h3>Members for selected Group not found in the database. Why not add one?</h3> 
                        <Button variant="primary" onClick={() => this.setStateAction("create")}>Add Member</Button>
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
                    <h3>All Members of the selected Group in database</h3>
                    <h5>Currently count of Memebers for selected Group in database is: {this.state.count}</h5>
                    <h5>To Filter Data use SearchBox</h5>
                    <SearchBox array={this.state.members} type="users" sendResults={this.setFilteredMembers}></SearchBox>
                    <Table striped bordered hover size="sm" responsive="md" id = "mmessages">
                        <tbody>
                            <tr>
                               {this.renderTableHeader()}
                               <th key = "groupid">Group ID</th>
                               <th key = "options">Options</th>
                            </tr>
                            {this.renderTableData()}
                        </tbody>
                    </Table>
                    <div align="left">
                        <h4>To add new Member select Add option</h4>
                        <Button variant="primary" onClick={() => this.setStateAction("create")}>Add Member</Button>
                    </div>
                    <div align="left">
                        <h5>To manipulate with user data please go back to Admin Users Panel</h5>
                        <h4>To go back to Main Admin Panel select Go Back option</h4>
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
        case "create":
            element = this.openFormForCreate();
            break;
        case "browseAfter":
            element = this.renderBrowse();
            break;
        default:
            element = <div>Error: this.state.action is not valid.</div>;
            break;
        }
    
        return element;
    }
    //#endregion
}

export default AdminGroupMembersPanel;