import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import "../../styles/global.css";
import "../../styles/animations.css";
import "../../styles/card.css";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

export class CreateCardForm extends Component {
  constructor(props) {
    super(props);

    this.cardset = props.cardset;

    if (props.action === "create") {
      this.state = {
        action: "create",
        cardCount: 0,
        qnSide: "",
        answSide: "",
        infobox: "Create a card by filling out the fields below.",
        infoboxStatus: "text-info",
      };
    } else if (props.action === "edit") {
      this.state = {
        action: "edit",
        qnSide: props.card.questionSide,
        answSide: props.card.answerSide,
        infobox: "Edit the fields below.",
        infoboxStatus: "text-info",
        card: props.card,
      };
    }
  }

  componentDidMount() {
    fetch(
      "https://localhost:5001/SLOTH/GetCardCount/" + this.props.cardset.id
    ).then((response) => {
      if (response.ok) {
        response.json().then((p) => {
          this.setState({ cardCount: p });
        });
      } else {
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
    });
  }
  
  //#region Fetches
  fetchCreateCard() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questionSide: this.state.qnSide,
        answerSide: this.state.answSide,
      }),
    };

    const fetchFunction = async () => {
      const response = await fetch(
        "https://localhost:5001/SLOTH/CreateCard/" + this.props.cardset.id,
        requestOptions
      );
      if (response.ok) {
        this.setState((prevState) => ({
          cardCount: prevState.cardCount + 1,
          infobox:
            "The card was created. You may now create another card for this cardset.",
          infoboxStatus: "text-success",
          qnSide: "",
          answSide: "",
        }));
      } else {
        this.setState({
          infobox:
            "The card was not created. There was an error with the server.",
          infoboxStatus: "text-danger",
        });
      }
    };

    fetchFunction();
  }

  fetchEditCard() {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: this.state.card.id,
        questionSide: this.state.qnSide,
        answerSide: this.state.answSide,
      }),
    };

    const fetchFunction = async () => {
      const response = await fetch(
        "https://localhost:5001/SLOTH/UpdateCard/",
        requestOptions
      );
      if (response.ok) {
        this.setState((prevState) => ({
          cardCount: prevState.cardCount + 1,
          infobox: "The card was updated successfully.",
          infoboxStatus: "text-success",
        }));
      } else {
        this.setState({
          infobox:
            "The card was not updated successfully. There was an error with the server.",
          infoboxStatus: "text-danger",
        });
      }
    };

    fetchFunction();
  }
  //#endregion

  //#region Event Handlers
  qnChangeHandler = (event) => {
    this.setState({ qnSide: event.target.value });
  }

  answChangeHandler = (event) => {
    this.setState({ answSide: event.target.value });
  }

  cancelHandler = (event) => {
    event.preventDefault();
    
    confirmAlert({
      title: 'Confirm to cancel',
      message: 'You sure you want to cancel?',
      buttons: [
        {
          label: 'Yup',
          onClick: () => {
            if(this.state.action === "create") {
              this.props.viewCardSet(this.cardset);
            }
            else if(this.state.action === "edit") {
              this.props.stopEditing();
            }
          }
        },
        {
          label: 'Nope'
        }
      ]
    });
  }

  cancel() {
    confirmAlert({
      title: 'Confirm to cancel',
      message: 'You sure you want to cancel?',
      buttons: [
        {
          label: 'Yup',
          onClick: () => {
            this.props.viewCardSet()
          }
        },
        {
          label: 'Nope'
        }
      ]
    });
    
  }

  createCard = (event) => {
    event.preventDefault();

    if (this.state.qnSide.length === 0) {
      confirmAlert({
        title: 'Error',
        message: 'You have to have a question!',
        buttons: [
          {
            label: 'Ok'
            }
        ]
      });
      return;
    }

    if (this.state.answSide.length === 0) {
      confirmAlert({
        title: 'Error',
        message: 'You have to have a answer!',
        buttons: [
          {
            label: 'Ok'
            }
        ]
      });
      return;
    }
    this.fetchCreateCard();
  }

  editCard = (event) => {
    event.preventDefault();

    // fetch please
    if (this.state.qnSide.length === 0) {
      confirmAlert({
        title: 'Error',
        message: 'You have to have a question!',
        buttons: [
          {
            label: 'Ok'
            }
        ]
      });
      return;
    }

    if (this.state.answSide.length === 0) {
      confirmAlert({
        title: 'Error',
        message: 'You have to have a answer!',
        buttons: [
          {
            label: 'Ok'
            }
        ]
      });
      return;
    }

    this.fetchEditCard();
  }
  //#endregion 

  //#region Renders
  renderCreate() {
    return (
      <React.Fragment>
        <p className="display-4">Create a Card</p>
        <p>
          Card {this.state.cardCount + 1} of {this.props.cardset.title}
        </p>
        <p className={this.state.infoboxStatus}>{this.state.infobox}</p>
        <Form className="container pt-5" onSubmit={this.createCard}>
          <div className="flex-row flex-centered">
            <Form.Group>
              <Form.Label>Question:</Form.Label>
              <div
                className="card card-div card-space"
                style={{ backgroundColor: this.props.cardset.color }}
              >
                <Form.Control
                  required
                  value={this.state.qnSide}
                  onChange={this.qnChangeHandler}
                />
              </div>
            </Form.Group>

            <Form.Group>
              <Form.Label>Answer:</Form.Label>
              <div
                className="card card-div card-space"
                style={{ backgroundColor: this.props.cardset.color }}
              >
                <Form.Control
                  required
                  value={this.state.answSide}
                  onChange={this.answChangeHandler}
                />
              </div>
            </Form.Group>
          </div>

          <Button variant="success" type="submit">
            Create Card
          </Button>
          <Button
            variant="danger"
            onClick={() => this.cancel()}
          >
            Cancel
          </Button>
        </Form>
      </React.Fragment>
    );
  }

  renderEdit() {
    return (
      <React.Fragment>
        <p className="display-4">Edit Card</p>
        <p className={this.state.infoboxStatus}>{this.state.infobox}</p>
        <Form className="container pt-5" onSubmit={this.editCard}>
          <div className="flex-row flex-centered">
            <Form.Group>
              <Form.Label>Question:</Form.Label>
              <div
                className="card card-div card-space"
                style={{ backgroundColor: this.props.cardset.color }}
              >
                <Form.Control
                  required
                  value={this.state.qnSide}
                  onChange={this.qnChangeHandler}
                />
              </div>
            </Form.Group>

            <Form.Group>
              <Form.Label>Answer:</Form.Label>
              <div
                className="card card-div card-space"
                style={{ backgroundColor: this.props.cardset.color }}
              >
                <Form.Control
                  required
                  value={this.state.answSide}
                  onChange={this.answChangeHandler}
                />
              </div>
            </Form.Group>
          </div>

          <Button variant="success" type="submit">
            Save
          </Button>
          <Button
            variant="danger"
            onClick={(this.cancelHandler)}
          >
            Cancel
          </Button>
        </Form>
      </React.Fragment>
    );
  }

  render() {
    if (this.state.action === "create") {
      return this.renderCreate();
    } else if (this.state.action === "edit") {
      return this.renderEdit();
    }
  }
  //#endregion
}

export default CreateCardForm;
