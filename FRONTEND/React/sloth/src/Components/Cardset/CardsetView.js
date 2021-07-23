import Button from "react-bootstrap/Button";
import React, { Component } from "react";

import CardsetInfo from "./CardsetInfo";
import CycleCards from "./CycleCards";
import Grade from "./Grade";

import "../../styles/global.css";
import "../../styles/materialview.css";
import CreateCardForm from "./CreateCardForm";
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

class CardsetView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cardset: props.cardset,
      noOfCards: 0,
      editingCard: false,
      card: null,
    };

    this.setNoOfCards = this.setNoOfCards.bind(this);
    this.editCard = this.editCard.bind(this);
    this.stopEditing = this.stopEditing.bind(this);
    this.deleteCard = this.deleteCard.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.cardset != this.props.cardset) {
      this.setState({ cardset: this.props.cardset, noOfCards: 0 });
    }
  }

  setNoOfCards(number) {
    this.setState({ noOfCards: number });
  }

  editCard = (card) => {
    this.setState({
      editingCard: true,
      card: card,
    });
  }

  deleteCard = (card) => {
    const requestOptions = {
      method: "Delete",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(),
    };

    let a = fetch(
      "https://localhost:5001/SLOTH/DeleteCard/" + card.id,
      requestOptions
    ).then((response) => {
      if (response.ok) {
        confirmAlert({
          title: 'Success',
          message: 'Card was successfully deleted.',
          buttons: [
            {
              label: 'Ok'
              }
          ]
        });
        return 1;
      } else {
        confirmAlert({
          title: 'Error',
          message: 'Card was not deleted, an error occured.',
          buttons: [
            {
              label: 'Ok'
              }
          ]
        });
        return 0;
      }
    })
    return a;
    
  }

  stopEditing = () => {
    this.setState({
      editingCard: false,
    });
  }

  deleteCardset = (event) => {
    event.preventDefault();

    const requestOptions = {
      method: "Delete",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(),
    };

    confirmAlert({
      title: 'Confirm to delete',
      message: 'You sure you want to delete?',
      buttons: [
        {
          label: 'Yup',
          onClick: async () => {
            fetch(
              "https://localhost:5001/SLOTH/DeleteCardSet/" + this.state.cardset.id,
              requestOptions
            ).then((response) => {
              if (response.ok) {
                this.props.enterPanel();
              }
            })
          }
        },
        {
          label: 'Nope'
        }
      ]
    });

    
  };

  renderViewUser() {
	  let gradeComp = null;
      if(this.props.whose === "group")
      {
        let who;
        if(this.props.teacher)
          who = "teacher";
        else
          who = "student"
        gradeComp = <Grade type = "cardset"
                           who = {who}
                           cardset={this.state.cardset}>
                           </Grade>
      }
    return (
      <div className="container-fluid flex-row">
        <div className="col-3 flex-column infobox">
          <div className="container-fluid flex-row justify-content-end">
            <IconButton
              variant="primary"
              onClick={() => this.props.editCardSet(this.state.cardset)}
            >
              <EditOutlinedIcon color="primary"></EditOutlinedIcon>
            </IconButton>
            <IconButton variant="danger" onClick={this.deleteCardset}>
              <DeleteIcon style={{color:"#ff0000"}}></DeleteIcon>
            </IconButton>
          </div>
		  {gradeComp}
          <CardsetInfo
            cardset={this.state.cardset}
            noOfCards={this.state.noOfCards}
          />
        </div>
        <div className="col-9">
          <div className="container-fluid flex-align-left">
            <Button
              variant="success"
              onClick={() => this.props.createCard(this.state.cardset)}
            >
              Create cards
            </Button>
          </div>
          <div className="card-space">
            <CycleCards
              cardsetID={this.state.cardset.id}
              editable={true}
              color={this.state.cardset.color}
              setNoOfCards={this.setNoOfCards}
              editCard={this.editCard}
              deleteCard={this.deleteCard}
            />
          </div>

          <Button variant="primary" onClick={this.props.enterPanel}>
            Close Set
          </Button>
        </div>
      </div>
    );
  }

  renderViewPublic() {
	  let gradeComp = null;
      if(this.props.whose === "group")
      {
        let who;
        if(this.props.teacher)
          who = "teacher";
        else
          who = "student"
        gradeComp = <Grade type = "cardset"
                           who = {who}
                           cardset={this.state.cardset}>
                           </Grade>
      }
    return (
      <div className="container-fluid flex-row">
        <div className="col-3 flex-column infobox">
		{gradeComp}
          <CardsetInfo
            cardset={this.state.cardset}
            noOfCards={this.state.noOfCards}
          />
        </div>
        <div className="col-6">
          <div className="card-space">
            <CycleCards
              cardsetID={this.state.cardset.id}
              cardsetVisibility={this.state.cardset.visibility}
              color={this.state.cardset.color}
              setNoOfCards={this.setNoOfCards}
            />
          </div>
          <Button variant="primary" onClick={this.props.enterPanel}>
            Close Set
          </Button>
        </div>
      </div>
    );
  }

  renderEditCard() {
    return (
      <div className="container-fluid flex-row">
        <div className="col-3 flex-column infobox">
          <div className="container-fluid flex-row">
            <Button
              variant="primary"
              onClick={() => this.props.editCardSet(this.state.cardset)}
            >
              Edit info
            </Button>
            <Button variant="danger" onClick={this.deleteCardset}>
              Delete cardset
            </Button>
          </div>
          <CardsetInfo
            cardset={this.state.cardset}
            noOfCards={this.state.noOfCards}
          />
        </div>
        <div className="col-9">
        <CreateCardForm card={this.state.card} action="edit" cardset={this.state.cardset} stopEditing={this.stopEditing}></CreateCardForm>

          <Button variant="primary" onClick={this.props.enterPanel}>
            Close Set
          </Button>
        </div>
      </div>
    );
  }

  render() {
    console.log(this.state.cardset.id);

    if(this.state.editingCard) {
      return this.renderEditCard();
    }
    else {
      if (this.props.whose === "user") {
        return this.renderViewUser();
      } else if (this.props.whose === "group") {

        console.log(this.props.owner);
        if(this.props.owner) {
          return this.renderViewUser();
        }
        else {
          return this.renderViewPublic();
        }

      } else if (this.props.whose === "public") {
        return this.renderViewPublic();
      }
    }
    return <div>CardsetView Error: this.props.whose is invalid.</div>;
  }
}

export default CardsetView;
