import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import MotivationalMessageForm from "./MotivationalMessageForm.js";
import SearchBox from "../Cardset/SearchBox.js";
import {MotivationMessage } from "../../Models/motivationMessage.js";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

class AdminMotivationalMessagesPanel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            view: "default",
            action: "browse",
            messages: [],
            filteredMessages: [],
            fetching: true,
            count: "",
        };

        this.setStateAction = this.setStateAction.bind(this);
        this.setFilteredMessages = this.setFilteredMessages.bind(this);
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
                this.setState({action: "browseAfter"});
                this.fetchMessages();
                break;
        }
    }

    setFilteredMessages(messages) {
        this.setState({filteredMessages: messages})
    }
    //#endregion
    
    //#region FetchFunctions
    fetchMessages() {
        this.setState({fetching: true});

        let msgs = [];
        fetch("https://localhost:5001/SLOTH/GetMotivationalMessages")
            .then(response => response.json())
            .then(data => {
                data.forEach(mm => {
                    let msg = new MotivationMessage(mm.id, mm.name, mm.message);
                    msgs.push(msg);
                });
                this.setState({messages: msgs, fetching: false, filteredMessages: msgs, count: msgs.length});
            })
            .catch(e => {
                this.setState({...this.state, fetching: false});
            })
    }
    //#endregion

    componentDidMount() {
        this.fetchMessages();
    }
    
    //#region Functions
    openFormForCreate() {
        return <MotivationalMessageForm setStateAction = {this.setStateAction}
                                        action="create"
                                        setMMChanged = {this.props.setMMChanged}>
                </MotivationalMessageForm>
    }

    openFormForEdit() {
        return <MotivationalMessageForm setStateAction = {this.setStateAction}
                                              action="edit"
                                              message = {this.state.messages[this.state.index]}
                                              setMMChanged = {this.props.setMMChanged}>
                </MotivationalMessageForm>
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
                    fetch("https://localhost:5001/SLOTH/DeleteMotivationalMessage/" + this.state.messages[index].id, requestOptions)
                        .then(response => {
                            if(response.ok) {
                                this.fetchMessages();
                            }  
                        })
                }
              },
              {
                label: 'Nope'
              }
            ]
          });
        this.props.setMMChanged();
    }
    //#endregion

    //#region RenderFunctions
    renderTableData() {
        return this.state.filteredMessages.map((msg, index) => {
            const {id, name, message} = msg;
            return (
                <tr key = {id}>
                    <td style={{backgroundColor:"#a0a6b0"}}>{id}</td>
                    <td>{name}</td>
                    <td>{message}</td>
                    <td><Button variant="primary" onClick={() => this.editSelected(index)}>Edit</Button></td>
                    <td><Button variant="danger" onClick={() => this.deleteSelected(index)}>Delete</Button></td>
                </tr>
            )
        })
    }

    renderTableHeader() {
        let header = Object.keys(this.state.messages[0]);
        return header.map((key, index) => {
            if (key.toUpperCase() === "ID") 
                return <th key = {index} style={{backgroundColor:"#a0a6b0"}}>{key.toUpperCase()}</th>
            else
                return <th key = {index}>{key.toUpperCase()}</th>
        })
    }

    renderBrowse() {
        let element;
        if (this.state.fetching) {
            element = <h3>We are getting messages ready wait a bit</h3>;
        }
        else
        {
            if(this.state.messages.length === 0)
            {    
                element = 
                <div>
                    <div>
                        <h3>Motivational Message not found in the database. Why not create one?</h3> 
                        <Button variant="primary" onClick={() => this.setStateAction("create")}>Create Motivational Message</Button>
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
                    <h3>All Motivational Messages in database</h3>
                    <h5>Currently count of Motivational Messages in database is: {this.state.count}</h5>
                    <h5>To Filter Data use SearchBox</h5>
                    <SearchBox array={this.state.messages} type="messages" sendResults={this.setFilteredMessages}></SearchBox>
                    <Table striped bordered hover size="sm" responsive="md" id = "mmessages">
                        <tbody>
                            <tr>
                               {this.renderTableHeader()}
                               <th key = "options" colSpan="2">Options</th>
                            </tr>
                            {this.renderTableData()}
                        </tbody>
                    </Table>
                    <div align="left">
                        <h4>To create new Motivational Message select Create option</h4>
                        <Button variant="primary" onClick={() => this.setStateAction("create")}>Create Motivational Messages</Button>
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
        default:
            element = <div>Error: this.state.view is not valid.</div>;
            break;
        }
    
        return element;
    }
    //#endregion
}

export default AdminMotivationalMessagesPanel;