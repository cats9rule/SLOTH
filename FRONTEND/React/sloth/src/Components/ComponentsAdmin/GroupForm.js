import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import "../../styles/global.css";
import { Group } from "../../Models/group";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

class GroupForm extends Component {
    constructor(props) {
        super(props);

        if (this.props.action === "create") {
            this.state = {
                action: "create",
                groupName: "Group Name",
                teacherID: ""
            }
        }
        if (this.props.action === "edit") {
            this.state = {
                action: "edit",
                groupName: this.props.group.name,
                teacherID: this.props.group.teacherID
            }
        }

        this.groupNameChangeHandler = this.groupNameChangeHandler.bind(this);
        this.teacherIDChangeHandler = this.teacherIDChangeHandler.bind(this);
    }

    groupNameChangeHandler = (event) => {
        this.setState({groupName: event.target.value});
    }

    teacherIDChangeHandler = (event) => {
        this.setState({teacherID: event.target.value});
    }

    fetchCreateGroup = () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json"  },
            body: JSON.stringify({
                name: this.state.groupName,
                teacherID: this.state.teacherID
            }),
        };

        const fetchFunction = async () =>  {
            const response = await fetch("https://localhost:5001/SLOTH/CreateGroup/", requestOptions);
            if (response.ok) {
                this.props.setStateAction();
            }
        }

        fetchFunction()
        
    }

    fetchEditCard = () => {
        const requestOptions = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: this.props.group.id,
                name: this.state.groupName,
                teacherID: this.state.teacherID
            }),
        };

        const fetchFunction = async () =>  {
            const response = await fetch("https://localhost:5001/SLOTH/UpdateGroup/", requestOptions);
            if (response.ok) {
                this.fetchCreateGroup();
            }
        }

        fetchFunction();
    }

    createGroup = (event) => {
        event.preventDefault();
        this.fetchCreateGroup();
    }

    editGroup = (event) => {
        event.preventDefault();
        this.fetchEditCard();
    }

    cancel() {
        confirmAlert({
            title: 'Confirm to cancel',
            message: 'You sure you want to cancel?',
            buttons: [
              {
                label: 'Yup',
                onClick: () => {
                    this.props.setStateAction();
                }
              },
              {
                label: 'Nope'
              }
            ]
          });
    }

    renderCreate() {
        return (
            <React.Fragment>
                <h3>Create Group</h3>
                <Form className="container pt-5" onSubmit={this.createGroup}>
                    <Form.Group as={Row}>
                        <Form.Label column sm={2}>
                            Group Name:
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control required 
                                          value={this.state.groupName}
                                          onChange={this.groupNameChangeHandler}/>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row}>
                        <Form.Label column sm={2}>
                            Teacher ID:
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control required 
                                          aria-describedby="userid-helpblock"
                                          value={this.state.teacherID}
                                          onChange={this.teacherIDChangeHandler}/>
                            <Form.Text id="userid-helpblock" muted>
                                Teacher ID must be number and exisiting in database.
                            </Form.Text>
                        </Col>
                    </Form.Group>
                
                    <Row>
                        <Button variant="success" type="submit">
                            Create
                        </Button>
                        <Button variant="danger" onClick={() => this.cancel()}>
                            Cancel
                        </Button>
                    </Row>
                </Form>
            </React.Fragment>
        )
    }

    renderEdit() {
        return (
            <React.Fragment>
                <h3>Edit Group</h3>
                <Form className="container pt-5" onSubmit={this.editGroup}>
                    <Form.Group as={Row}>
                        <Form.Label column sm={2}>
                            Group Name:
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control required 
                                          value={this.state.groupName}
                                          onChange={this.groupNameChangeHandler}/>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row}>
                        <Form.Label column sm={2}>
                            Teacher ID:
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control required 
                            aria-describedby="userid-helpblock"
                                          value={this.state.teacherID}
                                          onChange={this.teacherIDChangeHandler}/>
                            <Form.Text id="userid-helpblock" muted>
                                Teacher ID must be number and exisiting in database.
                            </Form.Text>
                        </Col>
                    </Form.Group>
                
                    <Row>
                        <Button variant="success" type="submit">
                            Update
                        </Button>
                        <Button variant="danger" onClick={() => this.cancel()}>
                            Cancel
                        </Button>
                    </Row>
                </Form>
            </React.Fragment>
        )
    }

    render() {
        let element = null;
        if (this.state.action === "create") {
            element = this.renderCreate();
        }
        else if (this.state.action === "edit") {
            element = this.renderEdit();
        }
        else {
            element = 
            <div>
                GroupForm Error: this.props.action is not valid.
                <br />
                this.props.action: {this.props.action}
            </div>
        }

        return element;
    }
}

export default GroupForm;