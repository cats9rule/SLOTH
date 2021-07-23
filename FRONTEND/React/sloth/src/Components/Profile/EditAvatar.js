import Avatar from "./../../Models/avatar.js";
import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import Image from 'react-bootstrap/Image'
import Button from 'react-bootstrap/Button'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'

export class EditAvatar extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             avatar: this.props.user.avatar
        }

        this.avatar = new Avatar();
        this.timeout2 = null;
    }

    changeAvatar = (src) => {
        this.setState({
            avatar: src
        })
    }

    confirmChanges = () => {
        this.props.editAvatar(this.state.avatar)
        // this.props.goBack();
    }

    ConfirmChanges = () => {
        confirmAlert({
            title: 'Confirm to update',
            message: 'You sure you want to update avatar?',
            buttons: [
              {
                label: 'Yup',
                onClick: this.confirmChanges
              },
              {
                label: 'Nope'
              }
            ]
          });
    }

    goBack = () => {
        confirmAlert({
            title: 'Confirm to cancel',
            message: 'You sure you want to cancel?',
            buttons: [
              {
                label: 'Yup',
                onClick: this.props.goBack
              },
              {
                label: 'Nope'
              }
            ]
          });
    }

    IsDisabled = () => {
        if(this.state.avatar === this.props.user.avatar) return true
        else return false
    }

    render() {
        let isDisabled = this.IsDisabled()
        let avatars = this.avatar.arrayOfAvatars.map((a) => {
            return <Image key={a} src={this.avatar.showAvatar(a)} roundedCircle onClick={() => this.changeAvatar(a)}></Image>
        })
        let element = (
            <div className="container-fluid flex-row">
                <div className="col-3">
                    <Form.Label>Your avatar:</Form.Label>
                    <Image src={this.avatar.showAvatar(this.state.avatar)} roundedCircle></Image>
                    <Button variant="success" onClick={this.ConfirmChanges} disabled={isDisabled}>Confirm</Button>
                    <Button variant="danger" onClick={this.goBack}>Cancel</Button>
                </div>
                <div className="col-9">
                    <Form.Label>Choose new avatar:</Form.Label>
                    <div>{avatars}</div>
                </div>
            </div>
        )

        return element
    }
}

export default EditAvatar
