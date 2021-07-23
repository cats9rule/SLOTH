import React, { Component } from "react";
import CardView from "./CardView";
import NoteView from "../Notebook/NoteView";

import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

import Button from "react-bootstrap/Button";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

import "../../styles/materialview.css";
import "../../styles/animations.css";

/**
 * KOMPONENTA CYCLECARDS:
 *
 * Komponenta treba da renderuje kartice tako da mogu da se ciklično smenjuju.
 * Poziva se u CARDSETPANEL.
 * ---------------------------------------------------------------------------------------------------------------------
 * PROPS:
 *   - color - boja seta
 *   - editable - true/false (da li korisnik može da edituje ili ne)
 * ---------------------------------------------------------------------------------------------------------------------
 * STATE:
 *   - fetching - da li komponenta čeka na podatke iz baze
 *   - cards - niz u koji se smeštaju kartice iz baze
 *   - currentCard - pokazuje karticu koji se prikazuje
 * ---------------------------------------------------------------------------------------------------------------------
 */

class CycleCards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardset: props.cardset,
      fetching: true,
      cards: [],
      currentCard: null,
      animation: "animation-fadeIn",
    };

    this.animationlist = [
      "animation-slideInLeft",
      "animation-slideOutLeft",
      "animation-slideInRight",
      "animation-slideOutRight",
    ];

    this.nextObject = this.nextObject.bind(this);
    this.prevObject = this.prevObject.bind(this);
    this.afterConfirmDeleteCard = this.afterConfirmDeleteCard.bind(this);
  }

  nextObject() {
    let index = this.state.cards.findIndex(
      (element) => element.id === this.state.currentCard.id
    );
    if (index === this.state.cards.length - 1) {
      index = 0;
    } else {
      index++;
    }
    this.setState({
      animation: this.animationlist[1],
    });
    setTimeout(() => {
      this.setState({
        currentCard: this.state.cards[index],
        animation: this.animationlist[0],
      });
    }, 400);
  }
  prevObject() {
    let index = this.state.cards.findIndex(
      (element) => element.id === this.state.currentCard.id
    );

    let f = false;
    if (index === 0) {
      index = this.state.cards.length - 1;
    } else {
      index--;
    }
    this.setState({
      animation: this.animationlist[3],
    });
    setTimeout(() => {
      this.setState({
        currentCard: this.state.cards[index],
        animation: this.animationlist[2],
      });
    }, 400);
  }

  fetchCards() {
    this.setState({
      fetching: true,
    });

    // fetch code

    fetch("https://localhost:5001/SLOTH/GetCards/" + this.props.cardsetID)
      .then((response) => response.json())
      .then((data) => {
        this.setState({ cards: data, currentCard: data[0], fetching: false });
        this.props.setNoOfCards(data.length);
      })
      .catch((e) => {
        this.setState({ ...this.state, fetching: false });
      });
  }

  deleteCard = (card) => {
    confirmAlert({
      title: "Confirm to delete",
      message: "You sure you want to delete?",
      buttons: [
        {
          label: "Yup",
          onClick: () => {
            this.afterConfirmDeleteCard(card);
          },
        },
        {
          label: "Nope",
        },
      ],
    });
  };

  afterConfirmDeleteCard(card) {
    let status = this.props.deleteCard(card);
    let ind = -1;
    let newCards = null;
    newCards = this.state.cards.filter((c, i) => {
      if (c.id !== card.id) {
        return c;
      } else {
        ind = i;
      }
    });

    if (newCards.length > 0) {
      if (ind !== this.state.cards.length - 1) {
        this.setState({
          currentCard: this.state.cards[ind + 1],
        });
      } else {
        this.setState({
          currentCard: this.state.cards[0],
        });
      }

      this.setState({
        cards: newCards,
      });
    } else {
      this.setState({
        cards: [],
      });
    }
  }

  componentDidMount() {
    this.fetchCards();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.currentCard != this.state.currentCard) {
    }
  }

  render() {
    if (this.state.fetching) {
      return <h1>Fetching data...</h1>;
    }

    if (this.state.cards.length == 0) {
      return <h6>There are no cards in this set.</h6>;
    }

    let object;

    const prevArrow = (
      <IconButton variant="secondary" onClick={this.prevObject}>
        <NavigateBeforeIcon></NavigateBeforeIcon>
      </IconButton>
    );

    const nextArrow = (
      <IconButton variant="secondary" onClick={this.nextObject}>
        <NavigateNextIcon></NavigateNextIcon>
      </IconButton>
    );

    if (this.state.currentCard) {
      object = (
        <CardView
          card={this.state.currentCard}
          color={this.props.color}
          animation={this.state.animation}
        ></CardView>
      );
    }

    let btnEdit = <div></div>;

    let btnDelete = <div></div>;

    if (this.props.editable) {
      btnEdit = (
        <IconButton
          variant="primary"
          onClick={() => this.props.editCard(this.state.currentCard)}
        >
          <EditOutlinedIcon color="primary"></EditOutlinedIcon>
        </IconButton>
      );

      btnDelete = (
        <IconButton
          variant="danger"
          onClick={() => this.deleteCard(this.state.currentCard)}
        >
          <DeleteIcon style={{ color: "#ff0000" }}></DeleteIcon>
        </IconButton>
      );
    }

    const element = (
      <React.Fragment>
        <div className="container material-container">
          {prevArrow}
          {object}
          {nextArrow}
        </div>
        {btnEdit}
        {btnDelete}
      </React.Fragment>
    );

    return element;
  }
}

export default CycleCards;
