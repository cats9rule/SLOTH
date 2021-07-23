import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import "../../styles/global.css";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

class StudyPlanForm extends Component {
    constructor(props) {
        super(props);
        if(this.props.action === "create") {
            this.state = {
                action: "create",
                name: "New Study Plan",
                workTime: 0,
                breakTime: 0,
                wHours: 0,
                wMinutes: 0,
                bHours: 0,
                bMinutes: 0,
                userid: -1
            };
        }
        if(this.props.action === "edit") {
            this.state = {
                action: "edit",
                name: this.props.studyplan.name,
                workTime: 0,
                breakTime: 0,
                wHours: Math.trunc(Number.parseInt(this.props.studyplan.workTime) / 60),
                wMinutes: Number.parseInt(this.props.studyplan.workTime) - (Math.trunc((Number.parseInt(this.props.studyplan.workTime) / 60))*60),
                bHours: Math.trunc(Number.parseInt(this.props.studyplan.breakTime) / 60),
                bMinutes: Number.parseInt(this.props.studyplan.breakTime) - (Math.trunc(Number.parseInt(this.props.studyplan.breakTime) / 60)*60)
            };
        }

        this.nameChangeHandler = this.nameChangeHandler.bind(this);
        this.wHoursChangeHandler = this.wHoursChangeHandler.bind(this);
        this.wMinutesChangeHandler = this.wMinutesChangeHandler.bind(this);
        this.bHoursChangeHandler = this.bHoursChangeHandler.bind(this);
        this.bMinutesChangeHandler = this.bMinutesChangeHandler.bind(this);
        this.useridChangeHandler = this.useridChangeHandler.bind(this);
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

    useridChangeHandler = (event) => {
        this.setState({userid: event.target.value})
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
            const response = await fetch("https://localhost:5001/SLOTH/CreateStudyPlan/" + this.state.userid, requestOptions);
            if (response.ok) {
                response.json().then((p) => {
                    this.setState({newStudyPlanID: p});
                    this.props.setStateAction();
                });
            }         
        }

        fetchFunction();
    }

    fetchUpdateStudyPlan(){
        const requestOptions = {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                id: this.props.studyplan.id,
                name: this.state.name,
                workTime: Number.parseInt(this.state.wHours) * 60 + Number.parseInt(this.state.wMinutes),
                breakTime: Number.parseInt(this.state.bHours) * 60 + Number.parseInt(this.state.bMinutes),
            }),
        };

        const fetchFunction = async () => {
            
            const response = await fetch("https://localhost:5001/SLOTH/UpdateStudyPlan",
            requestOptions);
            if (response.ok) {
                this.props.setStateAction();
            }
        }

        fetchFunction();
    }

    createStudyPlan = (event) => {
        event.preventDefault();
        this.fetchCreateStudyPlan();
    }

    updateStudyPlan = (event) => {
        event.preventDefault();
        this.fetchUpdateStudyPlan();
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
        return(
            <React.Fragment>
                <h3>Create Study Plan</h3>
                <Form className="container" onSubmit={this.createStudyPlan}>
                    <Form.Group as = {Row}>
                        <Form.Label column sm={2}>
                            Session name:
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control required
                                          aria-describedby="name-helpblock"
                                          value = {this.state.name}
                                          onChange={this.nameChangeHandler}/>  
                            <Form.Text id="name-helpblock" muted>
                                Name must not contain any special characters.
                            </Form.Text>
                        </Col>
                    </Form.Group>
                    <Form.Group as = {Row}>
                        <Form.Label column sm={2}>
                            User ID:
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control required
                                          aria-describedby="userid-helpblock"
                                          value = {this.state.userid}
                                          onChange={this.useridChangeHandler}/>  
                            <Form.Text id="userid-helpblock" muted>
                                User ID must be number and exisiting in database.
                            </Form.Text>
                        </Col>
                    </Form.Group>
    
                    <Form.Group as = {Row}>
                        <h5 sm={3}>
                            Work time:
                        </h5>
                    </Form.Group>   
                    <Form.Group as = {Row}>
                        <Form.Group as = {Col} sm={4}>
                            <Form.Label>
                                Hours:
                            </Form.Label>
                            <Row>
                                <Form.Control min="0"
                                              max="59"
                                              type="number"
                                              value={this.state.wHours}
                                              onChange={this.wHoursChangeHandler}/> 
                            </Row>
                        </Form.Group>
                        <Form.Group as = {Col} sm={4}>
                            <Form.Label>
                                Minutes:
                            </Form.Label>
                            <Row>
                                <Form.Control min="0"
                                              max="59"
                                              type="number"
                                              value={this.state.wMinutes}
                                              onChange={this.wMinutesChangeHandler}/>
                            </Row>
                        </Form.Group> 
                    </Form.Group>
                    <Form.Group as = {Row}>
                        <h5 sm = {3}>
                            Break time:
                        </h5>
                    </Form.Group>   
                    <Form.Group as = {Row}>
                        <Form.Group as = {Col} sm={4}>
                            <Form.Label>
                                Hours:
                            </Form.Label>
                            <Row>
                                <Form.Control min="0"
                                              max="59"
                                              type="number"
                                              value={this.state.bHours}
                                              onChange={this.bHoursChangeHandler}/>
                            </Row>
                        </Form.Group>
                        <Form.Group as = {Col} sm={4}>
                            <Form.Label>
                                Minutes:
                            </Form.Label>
                            <Row>
                                <Form.Control min="0"
                                              max="59"
                                              type="number"
                                              value={this.state.bMinutes}
                                              onChange={this.bMinutesChangeHandler}/>
                            </Row>
                        </Form.Group> 
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
            );
    }

    renderEdit() {
        return(
            <React.Fragment>
                <h3>Edit Study Plan</h3>
                <Form className="container" onSubmit={this.updateStudyPlan}>
                    <Form.Group as = {Row}>
                        <Form.Label column sm={2}>
                            Session name:
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control required
                                          aria-describedby="name-helpblock"
                                          value = {this.state.name}
                                          onChange={this.nameChangeHandler}/>  
                            <Form.Text id="name-helpblock" muted>
                                Name must not contain any special characters.
                            </Form.Text>
                        </Col>
                    </Form.Group>
    
                    <Form.Group as = {Row}>
                        <h5 sm={3}>
                            Work time:
                        </h5>
                    </Form.Group>   
                    <Form.Group as = {Row}>
                        <Form.Group as = {Col} sm={4}>
                            <Form.Label>
                                Hours:
                            </Form.Label>
                            <Row>
                                <Form.Control min="0"
                                              max="59"
                                              type="number"
                                              value={this.state.wHours}
                                              onChange={this.wHoursChangeHandler}/> 
                            </Row>
                        </Form.Group>
                        <Form.Group as = {Col} sm={4}>
                            <Form.Label>
                                Minutes:
                            </Form.Label>
                            <Row>
                                <Form.Control min="0"
                                              max="59"
                                              type="number"
                                              value={this.state.wMinutes}
                                              onChange={this.wMinutesChangeHandler}/>
                            </Row>
                        </Form.Group> 
                    </Form.Group>
                    <Form.Group as = {Row}>
                        <h5 sm = {3}>
                            Break time:
                        </h5>
                    </Form.Group>   
                    <Form.Group as = {Row}>
                        <Form.Group as = {Col} sm={4}>
                            <Form.Label>
                                Hours:
                            </Form.Label>
                            <Row>
                                <Form.Control min="0"
                                              max="59"
                                              type="number"
                                              value={this.state.bHours}
                                              onChange={this.bHoursChangeHandler}/>
                            </Row>
                        </Form.Group>
                        <Form.Group as = {Col} sm={4}>
                            <Form.Label>
                                Minutes:
                            </Form.Label>
                            <Row>
                                <Form.Control min="0"
                                              max="59"
                                              type="number"
                                              value={this.state.bMinutes}
                                              onChange={this.bMinutesChangeHandler}/>
                            </Row>
                        </Form.Group> 
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
            );
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
                CreateMotivationalMessage Error: this.props.action is not valid.
                <br />
                this.props.action: {this.props.action}
            </div>
        }

        return element;
    }
}

export default StudyPlanForm;
