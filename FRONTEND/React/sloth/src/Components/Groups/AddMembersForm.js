import React, {Component} from "react";
import SearchBox from "../Cardset/SearchBox.js";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import RenderUsers from "./RenderUsers.js";
import {User} from "../../Models/user.js";

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

/**
 * KOMPONENTA ADDMEMBERSFORM
 * - dodavanje novih clanova
 *  props:
 *  group
 */
class AddMembersForm extends Component 
{
    constructor(props){
        super(props);

        this.state = {
            usersToAdd:[], //korisnici koji treba da se dodaju u grupu
            allUsers:[], //all users - fetchovani korisnici
            groupMembers: [], //clanovi grupe
            fetching: true,
            filteredUsers: [], //rezultat pretrage
            pendingInvitations: [], //vec poslati pozivi

        }

        this.setFilteredUsers = this.setFilteredUsers.bind(this);
        this.selectUser = this.selectUser.bind(this);
        this.deselectUser = this.deselectUser.bind(this);
    }

    setFilteredUsers(users){
        this.setState({
            filteredUsers: users
        });
    }

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
    checkUser(u)
    {
        let result = this.state.groupMembers.findIndex((user) => user.id === u.id);
        return (result === -1);
    }

    checkUserInPendingInvites(u)
    {
        let result = this.state.pendingInvitations.findIndex((user) => user.id === u.id);
        return (result === -1);
    }

    fetchGetMembers()
    {
        this.setState({
            fetching: true,

        });
        fetch("https://localhost:5001/SLOTH/GetMembers/" + this.props.group.id)
            .then(response => response.json())
            .then(data => {
                this.setState({groupMembers: data});

                let allUsersTemp = this.state.allUsers;
                let res = allUsersTemp.filter((u) => this.checkUser(u));   
                
                this.setState({
                    allUsers: res,
                    fetching: false,
                }, () => this.fetchPendingInvitations());

                
            })
            .catch(e =>{
                this.setState({...this.state, fetching: false});
            })
    }

    fetchPendingInvitations()
    {
        console.log("PENDING");
        this.setState({
            fetching: true,
        });

        fetch("https://localhost:5001/SLOTH/PendingInvitations/" + this.props.group.id)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    pendingInvitations: data,
                });

                let allUsersTemp = this.state.allUsers;
                let res = allUsersTemp.filter((u) => this.checkUserInPendingInvites(u));

                this.setState({
                    allUsers: res,
                    fetching:false,
                })
            })
            .catch(e => {
                this.setState({...this.state, fetching: false});
            })
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
            const response = await fetch("https://localhost:5001/SLOTH/AddMembers/" + this.props.group.id, 
                requestOptions);
                if(response.ok){

                    this.props.goBack();
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

                        if(!users.includes(newUser))
                            users.push(user);
                });
                
                this.setState({allUsers: users, fetching:false});

                this.fetchGetMembers();
            })
            .catch((e) => {
                console.log(e);
                this.setState({...this.state, fetching:false});
            });
    }
    add = (event) => {
        event.preventDefault();

        if(this.state.usersToAdd.length !== 0)
            this.fetchAddMembers();

    }
    componentDidMount(){
        this.fetchAllUsers();
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

    render()
    {
        if(this.state.fetching)
        {
            return <h1>Fetching data...</h1>
        }

        return(
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
                        <Button variant="danger" onClick={() => this.cancel()}>Cancel</Button>
                    </Row>
                    
                </Form>
            </div>
        );
    }
}
export default AddMembersForm;