import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Avatar from "./../../Models/avatar.js";
import Button from "react-bootstrap/Button";
import EditInfo from "./EditInfo.js";
import EditPassword from "./EditPassword.js";
import EditAvatar from "./EditAvatar.js";
import { User } from "./../../Models/user.js"

class ProfilePanel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            view: "home",
            username: this.props.user.username,
            firstname: this.props.user.firstName,
            lastname: this.props.user.lastName,
            avatar: this.props.user.avatar
        };

        // this.user = this.props.user;
        this.avatar = new Avatar();
    }

    backHome = () => {
        this.setState({
            view: "home"
        })

        let u = new User(this.props.user.id, this.state.username,"", this.props.user.tag, this.state.firstname,
            this.state.lastname, this.state.avatar, null, this.props.user.isAdmin)

        this.props.updateUser(u)
    }

    editInfo = () => {
        this.setState({
            view: "editInfo"
        })
    }

    editPassword = () => {
        this.setState({
            view: "editPassword"
        })
    }

    editAvatar = () => {
        this.setState({
            view: "editAvatar"
        })
    }
    
    editInfobox = (msg, msgStatus) => {
        this.setState({
            infobox: msg,
            infoboxStatus: msgStatus
        })
    }

    //#region Fetch

    changeAvatar = (src) => {
        const requestOptions = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            }),
        };
      
        const fetchFunction = async () => {
            const response = await fetch(
                "https://localhost:5001/SLOTH/UpdateAvatar/"+this.props.user.id+"/"+src,
                requestOptions
            );
            if (response.ok) {
                this.setState({
                view: "home",
                infobox: "The avatar was updated successfully.",
                infoboxStatus: "text-success",
                avatar: src
                });
                this.backHome()
            }   else {
                this.setState({
                infobox:
                    "The avatar was not updated successfully. There was an error with the server.",
                infoboxStatus: "text-danger",
                });
            }
        };

        fetchFunction();
    }

    validateUser = (passwOld, passwNew) => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: this.state.username + '#' + this.props.user.tag, 
                password: passwOld,
            }),
        };
        const fetchFunction = async () => {
            const response = await fetch(
                "https://localhost:5001/SLOTH/UserValidating/",
                requestOptions
            );
            if(response.ok) {
                this.changePassword(passwNew)
            }
            else if(response.status === 406)    {
                this.setState({
                    infobox: "Wrong password.",
                    infoboxStatus: "text-danger"
                })
            }
            else    {
                this.setState({
                    infobox: "Greska u UserValidating.",
                    infoboxStatus: "text-danger"
                })
            }
        }

        fetchFunction();
        
    }

    changePassword = (passw) => {
        const requestOptions = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                password: passw,
                id: this.props.user.id,
            }),
        };
        const fetchFunction = async () => {
            const response = await fetch(
                "https://localhost:5001/SLOTH/UpdatePassword/",
                requestOptions
            );
            if(response.ok) {
                this.setState({
                    view: "home",
                    infobox: "The password was updated successfully.",
                    infoboxStatus: "text-success",
                });
            }   
            else if(response.status === 406)    {
                this.setState({
                    view: "home",
                    infobox: "New password cannot be same as the old one.",
                    infoboxStatus: "text-danger"
                })
            }
            else {
                this.setState({
                    view: "home",
                    infobox: "The password was not updated successfully. There was an error with the server.",
                    infoboxStatus: "text-danger"
                })
            }
        }

        fetchFunction();
        
    }

    changeUsername = (username) => {
        const requestOptions = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            }),
        };
        const fetchFunction = async () => {
            const response = await fetch(
                "https://localhost:5001/SLOTH/UpdateUserName/"+this.props.user.id+"/"+username,
                requestOptions
            );
            if(response.ok) {
                this.setState({
                    view: "home",
                    infobox: "The username was updated successfully.",
                    infoboxStatus: "text-success",
                    username: username
                });
                this.backHome()
            }   else {
                this.setState({
                    view: "home",
                    infobox: "The username was not updated successfully. There was an error with the server.",
                    infoboxStatus: "text-danger"
                })
            }
        }

        fetchFunction();
    }

    changeName = (fname, lname) => {
        const requestOptions = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                firstName: fname,
                lastName: lname,
            }),
        };
        const fetchFunction = async () => {
            const response = await fetch(
                "https://localhost:5001/SLOTH/UpdateUser/"+this.props.user.id,
                requestOptions
            );
            if(response.ok) {
                this.setState({
                    view: "home",
                    infobox: "The first and/or last name were updated successfully.",
                    infoboxStatus: "text-success",
                    firstname: fname,
                    lastname: lname
                });
                this.backHome()
            }   else {
                this.setState({
                    view: "home",
                    infobox: "The first and last name were not updated successfully. There was an error with the server.",
                    infoboxStatus: "text-danger"
                })
            }
        }

        fetchFunction();
    }

    //#endregion

    //#region UpdateCurrent
    
    updateCurrentInfo = (fname, lname) => {
        this.setState({
            firstname: fname,
            lastname: lname
        })
    }

    updateCurrentUsername = (uname) => {
        this.setState({
            username: uname
        })
    }

    updateCurrentAvatar = (src) => {
        this.setState({
            avatar: src
        })
    }

    //#endregion

    profileEditInfo = () => {
        let element;
        let u = new User(this.props.user.id, this.state.username, "", this.props.user.tag, 
            this.state.firstname, this.state.lastname, this.state.avatar, null, this.props.user.isAdmin)

        if(this.state.view === "editInfo")  {
            element = (
                <React.Fragment>
                    <p className={this.state.infoboxStatus}>{this.state.infobox}</p>
                    <EditInfo
                        user={u}
                        editInfo={this.changeName}
                        editUsername={this.changeUsername}
                        goBack={this.backHome}
                        info={this.editInfobox} />
                </React.Fragment>
            )
        }
        else if(this.state.view === "editPassword") {
            element = (
                <React.Fragment>
                    <p className={this.state.infoboxStatus}>{this.state.infobox}</p>
                    <EditPassword
                        user={this.props.user}
                        editPassword={this.validateUser}
                        goBack={this.backHome}
                        info={this.editInfobox} />
                </React.Fragment>
            )
        }
        else if(this.state.view === "editAvatar")   {
            element = (
                <React.Fragment>
                    <p className={this.state.infoboxStatus}>{this.state.infobox}</p>
                    <EditAvatar 
                        user={this.props.user}
                        editAvatar={this.changeAvatar}
                        goBack={this.backHome}
                        info={this.editInfobox}
                        avatar={this.avatar}/>
                </React.Fragment>
            )
        }

        

        return element;
    }

    profileHome = () => {
        let element = (
            <React.Fragment>
            <p className={this.state.infoboxStatus}>{this.state.infobox}</p>
            <h3>Your profile</h3>
            <hr />
            <div className="container-fluid flex-row">
                <div className="col-6">
                    <Container> {/*poravnanje u Col-ovima levo*/}
                        <Row>
                            <Col>Username:</Col>    
                            <Col>{this.state.username}#{this.props.user.tag}</Col>
                        </Row>
                        <Row>
                            <Col>First Name: </Col>
                            <Col>{this.state.firstname}</Col>
                        </Row>
                        <Row>
                            <Col>Last Name: </Col>
                            <Col>{this.state.lastname}</Col>
                        </Row>
                    </Container>
                    <div className="container-fluid flex-column">
                        <Button variant="primary" 
                                onClick={this.editInfo}
                            >Edit Personal Info</Button>
                        <Button variant="primary" 
                                size="sm" 
                                onClick={this.editPassword}
                            >Change Password</Button>
                    </div>
                </div>
                <div className="col-6">
                    <p>Avatar: </p>
                    <Image src={this.avatar.showAvatar(this.state.avatar)} roundedCircle></Image>
                    <Button variant="primary"
                            onClick={this.editAvatar}
                        >Change Avatar</Button>
                </div>
            </div>
            </React.Fragment>
        )



        return element;
    }

    render() {
        let element;

        switch (this.state.view) {
            case "home":
                element = this.profileHome();
                break;
            case "editInfo":
                element = this.profileEditInfo();
                break;
            case "editPassword":
                element = this.profileEditInfo();
                break;
            case "editAvatar":
                element = this.profileEditInfo();
                break;

            default:
                element = <div>Nothing to render.</div>;
                break;

        }

        return element;
    }
}

export default ProfilePanel;