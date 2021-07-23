import React, { Component } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import { User } from "./../../Models/user";

import "../../styles/global.css";

class LoginForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: ""
    };

    this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
    this.passwChangeHandler = this.passwChangeHandler.bind(this);
    this.login = this.login.bind(this);
  }

  usernameChangeHandler = (event) => {
    this.setState({
      username: event.target.value
    });
  }
  passwChangeHandler = (event) => {
    this.setState({
      password: event.target.value
    });
  }

  login(event) {
    event.preventDefault();
    if(this.state.username && this.state.password) {
      let user = null;
      
      // ovde treba fetch za login, server da proverava da li korisnik postoji
      // i da li je password dobar
      // ako je okej onda se poziva userLogin funkcija 
      // u user promenljivu treba da se smeste parametri korisnika (user = new User(...))
      // sa podacima iz fetch-a
      console.log("rfgth");
      const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          "username": this.state.username,
          "password": this.state.password
        })
      };
      const tryfetch = async () => {
        const response = await fetch("https://localhost:5001/SLOTH/UserValidating", requestOptions);
        if(response.ok)
        {
          
          const data = await response.json();
          user = new User (data.id, data.username, data.password, data.tag, data.firstName, data.lastName, data.avatar, data.calendar, data.isAdmin);
          confirmAlert({
            title: 'Greetings!',
            message: `Welcome, ${data.firstName} ${data.lastName}!`,
            buttons: [
              {
                label: 'Hi!'
                }
            ]
          });
          this.props.userLogin(user);
        }
        else if(response.status === 405)
        {
          confirmAlert({
            title: 'Error',
            message: 'You entered wrong username or tag, try again.',
            buttons: [
              {
                label: 'Ok'
                }
            ]
          });
        }
        else if(response.status === 406)
        {
          confirmAlert({
            title: 'Error',
            message: 'You entered wrong password, try again.',
            buttons: [
              {
                label: 'Ok'
                }
            ]
          });
        }
      }
      tryfetch();
    }
    else {   // ovo zapravo nikad ne treba da se izvrši zbog required u Form.Control
      confirmAlert({
        title: 'Error',
        message: 'You must have username and password!',
        buttons: [
          {
            label: 'Ok'
            }
        ]
      });
    }
  }

  render() {
  let element = (
    <div className="row">
      <div className="col">
        <Form className="container pt-5" onSubmit={this.login}>
          <Form.Group controlId="formBasicUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control required type="text" placeholder="Enter username" value={this.state.username} onChange={this.usernameChangeHandler}/>
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control required type="password" placeholder="Password" value={this.state.passw} onChange={this.passwChangeHandler}/>
          </Form.Group>
          <Button variant="primary" type="submit"
          > 
            Login
          </Button>
        </Form>
      </div>
    </div>
  );
  return element;
};
}

export default LoginForm;
