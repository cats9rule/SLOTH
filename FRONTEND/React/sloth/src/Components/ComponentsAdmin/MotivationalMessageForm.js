import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import "../../styles/global.css";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

class MotivationalMessageForm extends Component {
    constructor(props) {
        super(props);
        if (this.props.action === "create") {
            this.state = {
                action: "create",
                mmName: "New Motivational Message",
                mmMessage: "Motivational Message Text"
            };
        }
        if (this.props.action === "edit") {
            this.state = {
                action: "edit",
                mmName: this.props.message.name,
                mmMessage: this.props.message.message
            };
        }

        this.nameChangeHandler = this.nameChangeHandler.bind(this);
        this.messageChangeHandler = this.messageChangeHandler.bind(this);
    }

    nameChangeHandler = (event) => {
        this.setState({mmName: event.target.value});
    }

    messageChangeHandler = (event) => {
        this.setState({mmMessage: event.target.value});
    }

    fetchCreateMotivationalMessage = () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: this.state.mmName,
                message: this.state.mmMessage
            }),
        };

        const fetchFunction = async () => {
            const response = await fetch("https://localhost:5001/SLOTH/CreateMotivationalMessage/", requestOptions);
            if (response.ok) {
                response.json().then((p) => {
                    this.setState({newMotivationalMessageID: p});
                    this.props.setStateAction();
                });
            }
        }

        fetchFunction();
    }

    fetchEditMotivationalMessage = () => {
        const requestOptions = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: this.props.message.id,
                name: this.state.mmName,
                message: this.state.mmMessage
            }),
        };

        const fetchFunction = async () => {
            const response = await fetch("https://localhost:5001/SLOTH/UpdateMotivationalMessage/", requestOptions);
            if (response.ok) {
                this.props.setStateAction();
            }
        }

        fetchFunction();
    }

    createMotivationalMessage = (event) => {
        event.preventDefault();
        //provere da li je sve uneto
        this.fetchCreateMotivationalMessage();
        this.props.setMMChanged();
    }

    editMotivationalMessage = (event) => {
        event.preventDefault();
        //provere da li je sve uneto
        this.fetchEditMotivationalMessage();
        this.props.setMMChanged();
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
                <h3>Create Motivational Message</h3>
                <Form className="container pt-5" onSubmit={this.createMotivationalMessage}>
                    <Form.Group as={Row}>
                        <Form.Label column sm={2}>
                            Name:
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control required 
                                          aria-describedby="name-helpblock"
                                          value={this.state.mmName}
                                          onChange={this.nameChangeHandler}/>
                            <Form.Text id="name-helpblock" muted>
                                Name must not contain any special characters.
                            </Form.Text>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row}>
                        <Form.Label column sm={2}>
                            Message:
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control required 
                                          value={this.state.mmMessage}
                                          onChange={this.messageChangeHandler}/>
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
                <h3>Edit Motivational Message</h3>
                <Form className="container pt-5" onSubmit={this.editMotivationalMessage}>
                    <Form.Group as={Row}>
                        <Form.Label column sm={2}>
                            Name:
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control required 
                                          aria-describedby="name-helpblock"
                                          value={this.state.mmName}
                                          onChange={this.nameChangeHandler}/>
                            <Form.Text id="name-helpblock" muted>
                                Name must not contain any special characters.
                            </Form.Text>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row}>
                        <Form.Label column sm={2}>
                            Message:
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control required 
                                          value={this.state.mmMessage}
                                          onChange={this.messageChangeHandler}/>
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
                MotivationalMessageForm Error: this.props.action is not valid.
                <br />
                this.props.action: {this.props.action}
            </div>
        }

        return element;
    }
}  

export default MotivationalMessageForm;