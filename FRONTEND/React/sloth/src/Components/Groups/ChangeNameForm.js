import React, {Component} from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

class ChangeNameForm extends Component
{
    constructor(props){
        super(props);

        this.state = {
            name: props.group.name,

        }

        this.nameChangeHandler = this.nameChangeHandler.bind(this);

    }

    nameChangeHandler = (event) => {
        this.setState({
            name: event.target.value
        });
    }

    fetchUpdateGroup()
    {
        const requestOptions = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id:this.props.group.id,
                name: this.state.name,
            }),
          };

        const fetchFunction = async () => {
            const response = await fetch("https://localhost:5001/SLOTH/UpdateGroup/",
                requestOptions);
            if(response.ok){
                confirmAlert({
                    title: 'Success',
                    message: 'Group was successfully updated.',
                    buttons: [
                      {
                        label: 'Ok'
                        }
                    ]
                  });
                this.props.group.name = this.state.name;
                this.props.goBack();
            }
            else
            {
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

    saveChanges = (event) =>{
        event.preventDefault();
        this.fetchUpdateGroup();
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
        return (
            <React.Fragment>
                <h2>Change Name</h2>
                <Form className="container" onSubmit={this.saveChanges}>
                    <Form.Group as = {Row}>
                        <Form.Label sm={3}>
                            Name:
                        </Form.Label>
                        <Col sm={9}>
                            <Form.Control
                                required
                                value = {this.state.name}
                                onChange = {this.nameChangeHandler}
                            />
                        </Col>
                    </Form.Group>

                    <Row>
                        <Button variant="success" type="submit">Save</Button>
                        <Button variant="danger" onClick={() => this.cancel()}>Cancel</Button>
                    </Row>

                </Form>
            </React.Fragment>
        );
    }
}
export default ChangeNameForm;