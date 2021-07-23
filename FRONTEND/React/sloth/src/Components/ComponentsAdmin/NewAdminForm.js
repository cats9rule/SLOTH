import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import "../../styles/global.css";
import { User } from "./../../Models/user";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

class NewAdminForm extends Component {
    constructor(props) {
        super(props);
        
        if(this.props.action === "create") {
            this.state = {
                action: "create",
                username: "",
                password: "",
                firstname: "",
                lastname: ""
            }
        }
        else if(this.props.action === "promote") {
            this.state = {
                action: "promote",
                userid: ""
            };
        }
        else if (this.props.action === "newUser") {
            this.state = {
                action: "newUser",
                username: "",
                password: "",
                firstname: "",
                lastname: ""
            }
        }
        else if (this.props.action === "edit") {
          this.state = {
            action: "edit",
            firstname: this.props.userfirstname,
            lastname: this.props.userlastname,
            userid: this.props.userid,
          }
        }        
    
        this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.firstnameChangeHandler = this.firstnameChangeHandler.bind(this);
        this.lastnameChangeHandler = this.lastnameChangeHandler.bind(this);
        this.useridChangeHandler = this.useridChangeHandler.bind(this);
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

    useridChangeHandler = (event) => {
                this.setState({
                userid: event.target.value
          });
    }

    fetchCreateNewAdminUser() {
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
              'lastName': this.state.lastname,
              'isAdmin': true
            })
          };
    
          const fetchFunction = async () => {
            const response = await fetch("https://localhost:5001/SLOTH/CreateUser", requestOptions);
            if (response.ok) {
              const data = await response.json();
              user = new User (data.id, data.username, data.password, data.tag, data.firstName, data.lastName, data.avatar, data.calendar);
              this.props.setStateView();
            }
          };
          
          fetchFunction();
        }
    }

    fetchCreateNewUser() {
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
              'lastName': this.state.lastname,
            })
          };
    
          const fetchFunction = async () => {
            const response = await fetch("https://localhost:5001/SLOTH/CreateUser", requestOptions);
            if (response.ok) {
              const data = await response.json();
              user = new User (data.id, data.username, data.password, data.tag, data.firstName, data.lastName, data.avatar, data.calendar);
              this.props.setStateAction();
            }
          };
          
          fetchFunction();
        }
    }

    fetchPromoteUser() {
        const requestOptions = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(),
        };

        fetch("https://localhost:5001/SLOTH/PromoteToAdmin/" + this.state.userid, requestOptions)
        .then(response => {
            if(response.ok) {
                this.props.setStateView();
            }  
          });
    }

    fetchUpdateUser() {
      if(this.state.firstname && this.state.lastname)
        {
          const requestOptions = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'firstName': this.state.firstname,
              'lastName': this.state.lastname
            })
          };
    
          const fetchFunction = async () => {
            const response = await fetch("https://localhost:5001/SLOTH/UpdateUser/" + this.state.userid, requestOptions);
            if (response.ok) {
              this.props.setStateAction();
            }
          };
          
          fetchFunction();
        }
    }

    createNewAdminUser = (event) => {
        event.preventDefault();

        this.fetchCreateNewAdminUser();
    }

    promoteUser = (event) => {
        event.preventDefault();

        this.fetchPromoteUser();
    }

    createNewUser = (event) => {
        event.preventDefault();

        this.fetchCreateNewAdminUser();
    }

    updateUser = (event) => {
        event.preventDefault();

        this.fetchUpdateUser();
    }

    cancel(what) {
      if (what === "action") {
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
      else {
        confirmAlert({
          title: 'Confirm to cancel',
          message: 'You sure you want to cancel?',
          buttons: [
            {
              label: 'Yup',
              onClick: () => {
                  this.props.setStateView();
              }
            },
            {
              label: 'Nope'
            }
          ]
        });
      }
    }

    renderCreate() {
        let element;
        element = (
        <React.Fragment>
            <h3>Create New Admin</h3>
            <Form className="container pt-5" onSubmit={this.createNewAdminUser}>
            <Form.Group>
              <Form.Label>Username</Form.Label>
              <Form.Control required aria-describedby="username-helpblock" value={this.state.username} onChange={this.usernameChangeHandler}/>
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
                <Form.Control required type="text" value={this.state.firstname} onChange={this.firstnameChangeHandler}/>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Last Name</Form.Label>
                <Form.Control required type="text" value={this.state.lastname} onChange={this.lastnameChangeHandler}/>
              </Form.Group>
            </Row>
            <Row>
                <Button variant="success" type="submit">
                    Create New Admin
                </Button>
                <Button variant="danger" onClick={() => this.cancel("view")}>
                    Cancel
                </Button>
            </Row>
          </Form>
        </React.Fragment>
          
        );
        return element;
    }

    renderPromote() {
        let element;
        element = (
            <React.Fragment>
            <h3>Promote User to Admin Role</h3>
            <Form className="container pt-5" onSubmit={this.promoteUser}>
            <Form.Group as={Row}>
                <Form.Label column sm={2}>
                    User ID:
                </Form.Label>
                <Col sm={10}>
                    <Form.Control required 
                                  aria-describedby="userid-helpblock"
                                  value={this.state.userid}
                                  onChange={this.useridChangeHandler}/>
                    <Form.Text id="userid-helpblock" muted>
                    User ID must be number and exisiting in database.
                    </Form.Text>
                </Col>
            </Form.Group>
            <Row>
                <Button variant="success" type="submit">
                    Promote
                </Button>
                <Button variant="danger" onClick={() => this.cancel("view")}>
                    Cancel
                </Button>
            </Row>           
            </Form>
            </React.Fragment>
            
        )

        return element;
    }

    renderNewUserCreate() {
        let element;
        element = (
        <React.Fragment>
            <h3>Create New User</h3>
            <Form className="container pt-5" onSubmit={this.createNewUser}>
            <Form.Group>
              <Form.Label>Username</Form.Label>
              <Form.Control required aria-describedby="username-helpblock" value={this.state.username} onChange={this.usernameChangeHandler}/>
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
                <Form.Control required type="text" value={this.state.firstname} onChange={this.firstnameChangeHandler}/>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Last Name</Form.Label>
                <Form.Control required type="text" value={this.state.lastname} onChange={this.lastnameChangeHandler}/>
              </Form.Group>
            </Row>
            <Row>
                <Button variant="success" type="submit">
                    Create New User
                </Button>
                <Button variant="danger" onClick={() => this.cancel("action")}>
                    Cancel
                </Button>
            </Row>
          </Form>
        </React.Fragment>
          
        );
        return element;
    }

    renderUpdate() {
      let element;
        element = (
        <React.Fragment>
            <h3>Create New User</h3>
            <Form className="container pt-5" onSubmit={this.updateUser}>
              <Form.Group as={Col}>
                <Form.Label>First Name</Form.Label>
                <Form.Control required type="text" value={this.state.firstname} onChange={this.firstnameChangeHandler}/>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Last Name</Form.Label>
                <Form.Control required type="text" value={this.state.lastname} onChange={this.lastnameChangeHandler}/>
              </Form.Group>
                <Button variant="success" type="submit">
                    Update
                </Button>
                <Button variant="danger" onClick={() => this.cancel("action")}>
                    Cancel
                </Button>
          </Form>
        </React.Fragment>
          
        );
        return element;
    }

    render() {
        let element = null;
        if (this.state.action === "create") {
            element = this.renderCreate();
        }
        else if (this.state.action === "promote") {
            element = this.renderPromote();
        }
        else if (this.state.action === "newUser") {
            element = this.renderNewUserCreate();
        }
        else if (this.state.action === "edit") {
            element = this.renderUpdate();
        }
        else {
            element = 
            <div>
                NewAdminForm Error: this.props.action is not valid.
                <br />
                this.props.action: {this.props.action}
            </div>
        }

        return element;
    }
}

export default NewAdminForm;
