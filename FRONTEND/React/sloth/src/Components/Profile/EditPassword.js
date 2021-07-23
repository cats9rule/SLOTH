import React, { Component } from 'react'
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

export class EditPassword extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             passwordOld: "",
             passwordNew: "",
             passwordNew1: ''
        }



    }
    
    changePasswordHandlerOld = (event) => {
        this.setState({
            passwordOld: event.target.value
        })
    }

    changePasswordHandlerNew = (event) => {
        this.setState({
            passwordNew: event.target.value 
        })
    }

    changePasswordHandlerNew1 = (event) => {
        this.setState({
            passwordNew1: event.target.value 
        })
    }

    confirmSave = () => {
        confirmAlert({
            title: 'Confirm to update',
            message: 'You sure you want to update password?',
            buttons: [
             {
                label: 'Yup',
                onClick: this.SaveChanges
             },
             {
                label: 'Nope'
             }
            ]
        });
    }

    SaveChanges = () => {
        let msg = ''
        let msgstatus = ''
        if(this.state.passwordNew !== this.state.passwordNew1)  {
            msg = "New password mismatch."
            msgstatus = "text-danger"
            this.props.info(msg, msgstatus)
        }
        else if (this.state.passwordNew === this.state.passwordOld) {
            msg = "New password cannot be same as the old one."
            msgstatus = "text-danger"
            this.props.info(msg, msgstatus)
        }
        else    {
            this.props.editPassword(this.state.passwordOld, this.state.passwordNew)
            this.props.goBack();
        }
            
    }

    IsDisabled = () => {
        if (this.state.passwordOld.length === 0
            || this.state.passwordNew.length === 0
            || this.state.passwordNew1.length === 0)
                return true
        else return false
    }

    render() {
        let isDisabled = this.IsDisabled()
        let element = (
            <React.Fragment>
                <Container>
                    <Row>
                        <Col><Form.Label>Current password:</Form.Label></Col>
                        <Col> 
                            <Form.Control
                                type="password"
                                placeholder={this.state.passwordOld}
                                value={this.state.passwordOld}
                                onChange={this.changePasswordHandlerOld}
                            ></Form.Control>
                        </Col>
                    </Row>
                    <Row>
                        <Col><Form.Label>New password:</Form.Label></Col>
                        <Col> 
                            <Form.Control
                                type="password"
                                placeholder={this.state.passwordNew}
                                value={this.state.passwordNew}
                                onChange={this.changePasswordHandlerNew}
                            ></Form.Control>
                        </Col>
                    </Row>
                    <Row>
                        <Col><Form.Label>Enter new password again:</Form.Label></Col>
                        <Col> 
                            <Form.Control
                                type="password"
                                placeholder={this.state.passwordNew1}
                                value={this.state.passwordNew1}
                                onChange={this.changePasswordHandlerNew1}
                            ></Form.Control>
                        </Col>
                    </Row>
                </Container>

                <Button variant="success" onClick={this.confirmSave} disabled={isDisabled}>Confirm</Button>
                <Button variant="danger" onClick={this.props.goBack}>Cancel</Button>

            </React.Fragment>


        )

        return element
    }
}

export default EditPassword
