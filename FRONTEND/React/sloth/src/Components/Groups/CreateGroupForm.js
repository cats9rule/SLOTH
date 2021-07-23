import React, {Component} from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import SearchBox from "../Cardset/SearchBox.js";
import RenderUsers from "./RenderUsers.js";
import {User} from "../../Models/user.js";
import {Group} from "../../Models/group.js";
import Members from "./Members.js";
import "../../styles/group.css";

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

class CreateGroupForm extends Component 
{
    constructor(props){
        super(props);

        this.state = {
            name: "",
            usersToAdd:[], //korisnici koji treba da se dodaju u grupu
            allUsers:[], //all users - fetchovani korisnici
            fetching: true,
            filteredUsers: [], //rezultat pretrage
            
        }

        this.groupID = null;

        this.nameChangeHandler = this.nameChangeHandler.bind(this);
        this.setFilteredUsers = this.setFilteredUsers.bind(this);
        this.deselectUser = this.deselectUser.bind(this);
        this.selectUser = this.selectUser.bind(this);
    }

    nameChangeHandler = (event) => {
        this.setState({
            name: event.target.value
        });
    }

    setFilteredUsers(users){
        this.setState({
            filteredUsers: users
        });
    }
    deselectUser(user)
    {
        let allUsersTemp = this.state.allUsers;
        if(!allUsersTemp.includes(user))
            allUsersTemp.push(user);

        let usersToAddTemp = this.state.usersToAdd.filter((u) => u !== user);
        this.setState({
            usersToAdd: usersToAddTemp,
            allUsers: allUsersTemp,
        });
    }
    selectUser(user)
    {
        let allUsersTemp = this.state.allUsers.filter((u) => u !== user);
        let filteredUsersTemp = this.state.filteredUsers.filter((u) => u !== user);

        let usersToAddTemp = this.state.usersToAdd;
        if(!usersToAddTemp.includes(user))
            usersToAddTemp.push(user);

        this.setState({
            usersToAdd: usersToAddTemp,
            allUsers: allUsersTemp,
            filteredUsers: filteredUsersTemp,
        })
    }
    fetchCreateGroup()
    {
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                teacherID: this.props.userID,
                name:this.state.name,

            }),
        };

        const fetchFunction = async() => {
            const response = await fetch("https://localhost:5001/SLOTH/CreateGroup", 
                requestOptions);
                if(response.ok){
                    response.json().then(p=>{
                        const group = new Group(p, this.props.userID, this.state.name);
                        this.groupID = p;
                        this.props.addGroup(group);
                        this.fetchAddMembers();

                    })
                }
                else {
                    confirmAlert({
                        title: 'Error',
                        message: 'There was a problem with the server. We are very sorry and hope to fix it soon!',
                        buttons: [
                          {
                            label: 'Ok'
                            }
                        ]
                      });
                }
        }

        fetchFunction();
    }
    fetchAddMembers()
    {
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
            const response = await fetch("https://localhost:5001/SLOTH/AddMembers/" + this.groupID, 
                requestOptions);
                if(response.ok){
                    confirmAlert({
                        title: 'Success',
                        message: 'Invites successfully sent!',
                        buttons: [
                          {
                            label: 'Ok'
                            }
                        ]
                      });
                    
                }
                else {
                    confirmAlert({
                        title: 'Error',
                        message: 'There was a problem with the server. We are very sorry and hope to fix it soon!',
                        buttons: [
                          {
                            label: 'Ok'
                            }
                        ]
                      });
                }
        }

        fetchFunction();

    }
    fetchAllUsers()
    {
        this.setState({
            fetching:true,
        });


        let users = [];

        fetch("https://localhost:5001/SLOTH/GetAllUsers")
            .then((response) => response.json())
            .then((data) => {
                data.forEach((user) => {
                    let newUser = new User(user.id, user.username, null, user.tag,
                        user.firstName, user.lastName, null, null, false);

                        if(!users.includes(newUser) && newUser.id !== this.props.userID)
                            users.push(user);
                });


                this.setState({allUsers: users, fetching:false});
            })
            .catch((e) => {
                console.log(e);
                this.setState({...this.state, fetching:false});
            });
    }
    create = (event) =>{
        event.preventDefault();

        this.fetchCreateGroup();

        this.props.goBack();
    }

    cancel() {
        confirmAlert({
            title: 'Confirm to cancel',
            message: 'You sure you want to cancel?',
            buttons: [
              {
                label: 'Yup',
                onClick: () => {
                    this.props.goBack();
                }
              },
              {
                label: 'Nope'
              }
            ]
          });
    }

    componentDidMount(){
        this.fetchAllUsers();
    }

    render(){
        if(this.state.fetching)
        {
            return <h1>Fetching data...</h1>
        }
        return (
            <div>
                <h2>Create New Group</h2>
                <Form className="container" onSubmit={this.create}>
                    <Form.Group as = {Row}>
                        <Form.Label sm={3}>
                            Name:
                        </Form.Label>
                        <Col sm={9}>
                            <Form.Control
                                required
                                value = {this.state.name}
                                placeholder = "Group name"
                                onChange = {this.nameChangeHandler}
                            />
                        </Col>
                    </Form.Group>

                    {/* <Form.Group as = {Row}>
                        <RenderUsers users={this.state.usersToAdd} onClk={this.deselectUser}></RenderUsers>
                    </Form.Group> */}

                    <Form.Group as={Row}>
                        <Form.Label column sm={2}>
                            Add users:
                        </Form.Label>   
                        <SearchBox array={this.state.allUsers} type="users" sendResults={this.setFilteredUsers}></SearchBox>                       
                    </Form.Group>

                    <Form.Group as = {Row} className="list-builder">
                        <Col sm={6} className="one-list one-list-border">
                            <RenderUsers users={this.state.filteredUsers} onClk={this.selectUser}></RenderUsers>
                        </Col>
                        <Col sm={6} className="one-list">
                            <div>Users to add:</div>
                        <RenderUsers users={this.state.usersToAdd} onClk={this.deselectUser}></RenderUsers>
                        </Col>
                    </Form.Group>
                    <Row>
                        <Button variant="success" type="submit">Create Group</Button>
                        <Button variant="danger" onClick={() => this.cancel()}>Cancel</Button>
                    </Row>
                </Form>
            </div>
        );
    }
}
export default CreateGroupForm;