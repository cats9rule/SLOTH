import React, { Component } from 'react';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

export class EditInfo extends Component {
    constructor(props)  {
        super(props)

        this.state = {
            username: this.props.user.username,
            firstname: this.props.user.firstName,
            lastname: this.props.user.lastName
        }

    }

    componentWillUnmount()  {
    }

    //#region ChangeInfoHandlers

    changeUNHandler = (event) => {
        this.setState({
            username: event.target.value
        })
    }

    changeFNHandler = (event) => {
        this.setState({
            firstname: event.target.value
        })
    }

    changeLNHandler = (event) => {
        this.setState({
            lastname: event.target.value
        })
    }

    //#endregion
    
    IsDisabled = () => {
        if(
            this.state.username === this.props.user.username 
            && this.state.firstname === this.props.user.firstName
            && this.state.lastname === this.props.user.lastName
        )   return true;
        else return false;
    }

    goBack = () => {
        this.props.goBack();
    }

    saveChanges = () => {
        if(this.state.firstname !== this.props.user.firstName || this.state.lastname !== this.props.user.lastName)
            this.props.editInfo(this.state.firstname, this.state.lastname)
        if(this.state.username !== this.props.user.username)
            this.props.editUsername(this.state.username)
    }

    SaveChanges = () => {
        confirmAlert({
            title: 'Confirm to update',
            message: 'You sure you want to update?',
            buttons: [
              {
                label: 'Yup',
                onClick: this.saveChanges
              },
              {
                label: 'Nope'
              }
            ]
          });
    }
    
    render() {
        let isDisabled = this.IsDisabled()
        let element = (
            <React.Fragment>
                <Container>
                    <Row>
                        <Col><Form.Label>New username:</Form.Label></Col>
                        <Col> 
                            <Form.Control
                                type="text"
                                placeholder={this.state.username}
                                value={this.state.username}
                                onChange={this.changeUNHandler}
                            ></Form.Control>
                        </Col>
                    </Row>
                    <Row>
                        <Col><Form.Label>New first name:</Form.Label></Col>
                        <Col>
                            <Form.Control
                                type="text"
                                placeholder={this.state.firstname}
                                value={this.state.firstname}
                                onChange={this.changeFNHandler}
                            ></Form.Control>
                        </Col>
                    </Row>
                    <Row>
                        <Col><Form.Label>New last name:</Form.Label></Col>
                        <Col>
                            <Form.Control
                                type="text"
                                placeholder={this.state.lastname}
                                value={this.state.lastname}
                                onChange={this.changeLNHandler}
                            ></Form.Control>
                        </Col>
                    </Row>
                </Container>

                <Button variant="success" onClick={this.SaveChanges} disabled={isDisabled}>Confirm</Button>
                <Button variant="danger" onClick={this.goBack}>Cancel</Button>
            </React.Fragment>


        )



        return element
    }
}

export default EditInfo
