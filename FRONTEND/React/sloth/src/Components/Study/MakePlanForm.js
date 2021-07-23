import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import { FormatBoldRounded } from "@material-ui/icons";

import {StudyPlan} from "../../Models/studyPlan.js";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

/**
 * KOMPONENTA MAKEPLANFORM
 * 
 *  Props:
 *  user - 
 */

class MakePlanForm extends Component {

    constructor(props){
        super(props);

        this.state = {
            name: "",
            workTime: 0,
            breakTime: 0,
            wHours: 0,
            wMinutes: 0,
            bHours: 0,
            bMinutes: 0

        }

        this.nameChangeHandler = this.nameChangeHandler.bind(this);
        this.wHoursChangeHandler = this.wHoursChangeHandler.bind(this);
        this.bHoursChangeHandler = this.bHoursChangeHandler.bind(this);
        this.bMinutesChangeHandler = this.bMinutesChangeHandler.bind(this);
    }

    nameChangeHandler = (event) => {
        this.setState({
            name: event.target.value
        });
    }

    wHoursChangeHandler = (event) => {
        this.setState({
            wHours: event.target.value
        })
    }
    wMinutesChangeHandler = (event) => {
        this.setState({
            wMinutes: event.target.value
        })
    }
    bHoursChangeHandler = (event) => {
        this.setState({
            bHours: event.target.value
        })
    }
    bMinutesChangeHandler = (event) => {
        this.setState({
            bMinutes: event.target.value
        })
    }

    fetchCreateStudyPlan(){
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                name: this.state.name,
                workTime: Number.parseInt(this.state.wHours) * 60 + Number.parseInt(this.state.wMinutes),
                breakTime: Number.parseInt(this.state.bHours) * 60 + Number.parseInt(this.state.bMinutes),
            }),
        };

        const fetchFunction = async () => {
            
            const response = await fetch("https://localhost:5001/SLOTH/CreateStudyPlan/" + this.props.user.id,
            requestOptions);
                if(response.ok){
                    response.json().then(p => {
                        const studyPlan = new StudyPlan(p, this.state.name,
                            Number.parseInt(this.state.wHours) * 60 + Number.parseInt(this.state.wMinutes), 
                            Number.parseInt(this.state.bHours) * 60 + Number.parseInt(this.state.bMinutes));
                        
                            this.props.addStudyPlan(studyPlan);
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

    start = () => {
        let workTimeInMs = (Number.parseInt(this.state.wHours) * 60 + Number.parseInt(this.state.wMinutes)) * 60000;
        let breakTimeInMs = (Number.parseInt(this.state.bHours) * 60 + Number.parseInt(this.state.bMinutes)) * 60000;
        this.props.startStudyPlan(workTimeInMs, breakTimeInMs);

        this.props.goBack();
    }
    saveAndStart = (event) =>{
        event.preventDefault();

        this.fetchCreateStudyPlan();
    
        this.start();
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

    render(){

        return(
        <div>
            <h2>Create New Study Plan</h2>
            <Form className="container" onSubmit={this.saveAndStart}>
                <Form.Group as = {Row}>
                    <Form.Label sm={3}>
                        Session name:
                    </Form.Label>
                    <Col sm={9}>
                        <Form.Control
                          required
                          value = {this.state.name}
                          placeholder = "Session name"
                          onChange={this.nameChangeHandler}
                        />  
                    </Col>
                </Form.Group>

                <Form.Group as = {Row}>
                    <h3 sm={3}>
                        Work time:
                    </h3>
                </Form.Group>   
                <Form.Group as = {Row}>
                    <Form.Group as = {Col} sm={4}>
                        <Form.Label>
                            Hours:
                        </Form.Label>
                        <Row>
                            <Form.Control
                                min="0"
                                max="59"
                                type="number"
                                value={this.state.wHours}
                                onChange={this.wHoursChangeHandler}
                            />
                            
                        </Row>

                    </Form.Group>
                    <Form.Group as = {Col} sm={4}>
                        <Form.Label>
                            Minutes:
                        </Form.Label>
                        <Row>
                            <Form.Control
                                min="0"
                                max="59"
                                type="number"
                                value={this.state.wMinutes}
                                onChange={this.wMinutesChangeHandler}
                            />
                            
                        </Row>

                    </Form.Group> 

                </Form.Group>

                <Form.Group as = {Row}>
                    <h3 sm = {3}>
                        Break time:
                    </h3>
                </Form.Group>   
                <Form.Group as = {Row}>
                    <Form.Group as = {Col} sm={4}>
                        <Form.Label>
                            Hours:
                        </Form.Label>
                        <Row>
                            <Form.Control
                                min="0"
                                max="59"
                                type="number"
                                value={this.state.bHours}
                                onChange={this.bHoursChangeHandler}
                            />
                            
                        </Row>

                    </Form.Group>
                    <Form.Group as = {Col} sm={4}>
                        <Form.Label>
                            Minutes:
                        </Form.Label>
                        <Row>
                            <Form.Control
                                min="0"
                                max="59"
                                type="number"
                                value={this.state.bMinutes}
                                onChange={this.bMinutesChangeHandler}
                            />
                            
                        </Row>

                    </Form.Group> 
                </Form.Group>
                <Row>
                        <Button variant="success" type="submit">Save And Start</Button>
                        <Button variant="success" onClick={this.start}>Start</Button>
                        <Button variant="danger" onClick={() => this.cancel()}>Cancel</Button>
                </Row>
             


            </Form>
        </div>
        );

    }
}

export default MakePlanForm;