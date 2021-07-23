import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import Button from "react-bootstrap/Button";

import { User } from "./../../Models/user";

import "../../styles/global.css";
import "../../styles/animations.css";

class SignUpForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
        username: "",
        password: "",
        firstname: "",
        lastname: ""
    }

    this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
    this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
    this.firstnameChangeHandler = this.firstnameChangeHandler.bind(this);
    this.lastnameChangeHandler = this.lastnameChangeHandler.bind(this)

    this.createProfile = this.createProfile.bind(this);
  }

  createProfile(event) {
    
    // treba fetch da se kreira korisnik u bazi
    // podaci se skupljaju iz this.state

    // ako fetch prođe okej, korisnik se automatski uloguje
    event.preventDefault();

    if(this.state.username && this.state.password && this.state.firstname && this.state.lastname)
    {
      let user = null;

      const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          'username': this.state.username,
          'password': this.state.password,
          'firstName': this.state.firstname,
          'lastName': this.state.lastname
        })
      };

      const fetchFunction = async () => {
        const response = await fetch("https://localhost:5001/SLOTH/CreateUser", requestOptions);
        if (response.ok) {
          const data = await response.json();
          user = new User (data.id, data.username, data.password, data.tag, data.firstName, data.lastName, data.avatar, data.calendar);
          console.log(user);
          this.props.userLogin(user);
          console.log(user);
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
      };
      
      fetchFunction();
    }

  }

  usernameChangeHandler = (event) => {
    this.setState({
      username: event.target.value
    });
  }
  passwordChangeHandler = (event) => {
    this.setState({
      password: event.target.value
    });
  }
  firstnameChangeHandler = (event) => {
    this.setState({
      firstname: event.target.value
    });
  }
  lastnameChangeHandler = (event) => {
    this.setState({
      lastname: event.target.value
    });
  }

  render() {
    let element;
    element = (
      <Form className="container pt-5" onSubmit={this.createProfile}>
        <Form.Group>
          <Form.Label>Username</Form.Label>
          <Form.Control required placeholder="welcomepeople" aria-describedby="username-helpblock" value={this.state.username} onChange={this.usernameChangeHandler}/>
          <Form.Text id="username-helpblock" muted>
          Username must not contain the character '#'.
          </Form.Text>
        </Form.Group>
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control required type="password" aria-describedby="passw-helpblock" value={this.state.password} onChange={this.passwordChangeHandler}/>
          <Form.Text id="username-helpblock" muted>
          Password must be at least 6 characters long. It is recommended to use a combination of numbers and capitalised letters as well, 
          for security reasons.
          We never share your information with anyone.
          </Form.Text>
        </Form.Group>
        <Row>
          <Form.Group as={Col}>
            <Form.Label>First Name</Form.Label>
            <Form.Control required type="text" placeholder="Sheldon" value={this.state.firstname} onChange={this.firstnameChangeHandler}/>
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>Last Name</Form.Label>
            <Form.Control required type="text" placeholder="Cooper" value={this.state.lastname} onChange={this.lastnameChangeHandler}/>
          </Form.Group>
        </Row>
        <Button variant="primary" type="submit"> 
            Sign Up
        </Button>
      </Form>
    );
    return element;
  }
}

export default SignUpForm;
