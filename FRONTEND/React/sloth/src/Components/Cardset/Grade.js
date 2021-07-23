import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row"

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

class Grade extends Component {
    constructor(props) {
        super(props);

        this.state = {
            type: this.props.type,
            who: this.props.who,
            grade: 1
        }

        this.gradeChangeHandler = this.gradeChangeHandler.bind(this);
    }

    gradeChangeHandler = (event) => {
        this.setState({grade: event.target.value});
    }

    componentDidMount() {
    }

    fetchGradeCardset = () => {
        const fetchFunction = async () =>  {
            const response = await fetch("https://localhost:5001/SLOTH/AddCardSetGrade/" + this.props.cardset.id + "/" + this.state.grade);
            if (response.ok) {
                this.props.cardset.grade = this.state.grade
                confirmAlert({
                    title: 'Successful',
                    message: 'You successfully graded this cardset.',
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
                    message: 'Grading this cardset was not successful.',
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

    fetchGradeNotebook = () => {
        const fetchFunction = async () =>  {
            const response = await fetch("https://localhost:5001/SLOTH/AddNotebookGrade/" + this.props.notebook.id + "/" + this.state.grade);
            if (response.ok) {
                this.props.notebook.grade = this.state.grade
                confirmAlert({
                    title: 'Successful',
                    message: 'You have successfully graded this notebook.',
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
                    message: 'Grading this notebook was not successful.',
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

    gradeCardset = (event) => {
        event.preventDefault();
        this.fetchGradeCardset();
    }

    gradeNotebook = (event) => {
        event.preventDefault();
        this.fetchGradeNotebook();
    }

    renderCardset() {
        let element;
        if(this.state.who === "student") {
            if (this.props.cardset.grade === 0)
                element = <h5>This {this.state.type} was not graded yet</h5>
            else
                element = (
                    <h5>This {this.state.type} was graded {this.props.cardset.grade}</h5>
                );
        }
        else {
            element = (
                <Form className="container pt-5" onSubmit={this.gradeCardset}>
                    <Form.Group as={Row}>
                        <Form.Label column sm={2}>
                            Grade:
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control required
                                          type="number"
                                          min="1"
                                          max="10" 
                                          value={this.state.grade}
                                          onChange={this.gradeChangeHandler}/>
                        </Col>
                        <Button variant="success" type="submit">
                            Grade
                        </Button>
                    </Form.Group>
                </Form>
            )
        }
        return element;
    }

    renderNotebook() {
        let element;
        if(this.state.who === "student") {
            if (this.props.notebook.grade === 0)
                element = <h5>This {this.state.type} was not graded yet</h5>
            else
                element = (
                    <h5>This {this.state.type} was graded {this.props.notebook.grade}</h5>
                );
        }
        else {
            element = (
                <Form className="container pt-5" onSubmit={this.gradeNotebook}>
                    <Form.Group as={Row}>
                        <Form.Label column sm={2}>
                            Grade:
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control required 
                                          type="number"
                                          min="1"
                                          max="10" 
                                          value={this.state.grade}
                                          onChange={this.gradeChangeHandler}/>
                        </Col>
                        <Button variant="success" type="submit">
                            Grade
                        </Button>
                    </Form.Group>
                </Form>
            )
        }
        return element;
    }

    render() {
        let element;
        if (this.state.type === "cardset") {
            element = this.renderCardset();
        }
        else {
            element = this.renderNotebook();
        }

        return element;
    }
}

export default Grade;