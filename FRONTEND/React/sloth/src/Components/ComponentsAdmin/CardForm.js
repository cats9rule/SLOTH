import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import "../../styles/global.css";
import { Card } from "../../Models/card";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

class CardForm extends Component {
    constructor(props) {
        super(props);

        if (this.props.action === "create") {
            this.state = {
                action: "create",
                questionSide: "Question Side",
                answerSide: "Answer Side"
            }
        }
        if (this.props.action === "edit") {
            this.state = {
                action: "edit",
                questionSide: this.props.card.questionSide,
                answerSide: this.props.card.answerSide
            }
        }

        this.qSideChangeHandler = this.qSideChangeHandler.bind(this);
        this.aSideChangeHandler = this.aSideChangeHandler.bind(this);
    }

    qSideChangeHandler = (event) => {
        this.setState({questionSide: event.target.value});
    }

    aSideChangeHandler = (event) => {
        this.setState({answerSide: event.target.value});
    }

    fetchCreateCard = () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json"  },
            body: JSON.stringify({
                questionSide: this.state.questionSide,
                answerSide: this.state.answerSide
            }),
        };

        const fetchFunction = async () =>  {
            const response = await fetch("https://localhost:5001/SLOTH/CreateCard/" + this.props.cardsetid, requestOptions);
            if (response.ok) {
                this.props.setStateAction();
            }
        }

        fetchFunction();
    }

    fetchEditCard = () => {
        const requestOptions = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: this.props.card.id,
                questionSide: this.state.questionSide,
                answerSide: this.state.answerSide
            }),
        };

        const fetchFunction = async () =>  {
            const response = await fetch("https://localhost:5001/SLOTH/UpdateCard/", requestOptions);
            if (response.ok) {
                this.props.setStateAction();
            }
        }

        fetchFunction();
    }

    createCard = (event) => {
        event.preventDefault();
        this.fetchCreateCard();
    }

    editCard = (event) => {
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
                <h3>Create Card</h3>
                <Form className="container pt-5" onSubmit={this.createCard}>
                    <Form.Group as={Row}>
                        <Form.Label column sm={2}>
                            Question Side:
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control required 
                                          value={this.state.questionSide}
                                          onChange={this.qSideChangeHandler}/>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row}>
                        <Form.Label column sm={2}>
                            Answer Side:
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control required 
                                          value={this.state.answerSide}
                                          onChange={this.aSideChangeHandler}/>
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
                <h3>Edit Card</h3>
                <Form className="container pt-5" onSubmit={this.editCard}>
                    <Form.Group as={Row}>
                        <Form.Label column sm={2}>
                            Question Side:
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control required 
                                          value={this.state.questionSide}
                                          onChange={this.qSideChangeHandler}/>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row}>
                        <Form.Label column sm={2}>
                            Answer Side:
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control required 
                                          value={this.state.answerSide}
                                          onChange={this.aSideChangeHandler}/>
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
                CardForm Error: this.props.action is not valid.
                <br />
                this.props.action: {this.props.action}
            </div>
        }

        return element;
    }
}

export default CardForm;
