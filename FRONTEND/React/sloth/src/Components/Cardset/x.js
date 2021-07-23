/**
 * 
 * 
 * IGNORISATI OVAJ FAJL, NE RADI I NE TREBA DA SE KORISTI, OVDE JE SAMO ZA SVAKI SLUČAJ 
 * U SLUČAJU DA JE NEŠTO PROPUŠTENO U NOVOM CARDSET PANEL FAJLU.
 * 
 * PROCEED WITH CAUTION!!!
 * 
 * 
 * DANGER ZONE1!!!!
 * 
 * HUMAN, NOOO!!!!
 * 
 * ...
 * 
 * 
 */




import React, { Component } from "react";
import RenderCardsets from "./RenderCardSets.js";
import RenderCards from "./RenderCards";
import CardView from "./CardView.js";
import CycleCards from "./CycleCards.js";

import { CardSet } from "../../Models/cardSet";

/**
 * KOMPONENTA CARDSETPANEL:
 *
 * Komponenta za prikaz i interakciju sa flash karticama.
 * Poziva se u SLOTHOVERLORD.
 * ---------------------------------------------------------------------------------------------------------------------
 * Props:
 *   - whose - da li renderuje public cardsets ili user cardsets (public/private/group)
 *   - user - this.props.user je objekat korisnika koji je ulogovan
 *   - group - ako je whose = group, prosleđen je objekat grupe
 *   - cardsets - ako je whose = public, onda je ovde prosleđen niz javnih cardsetova
 * ---------------------------------------------------------------------------------------------------------------------
 * State:
 *   - view: panel/cardset/card
 *   - action: view/edit/create
 * ---------------------------------------------------------------------------------------------------------------------
 */

class CardSetPanel extends Component {
  constructor(props) {
    super(props);

    switch(props.whose) {
      case "public":
        this.state = {
          view: "panel",
          whose: "public",
          fetching: true,
          cardsets: []
        }
        break;

      case "private":
        this.state = {
          view: "panel",
          whose: "private",
          user: props.user,
          fetching: true,
          cardsets: []
        }
        break;
      
      case "group":
          this.state = {
            view: "panel",
            whose: "group",
            user: props.user,
            group: props.group,
            fetching: true,
            cardsets: []
          }
          break;
    }

    this.enterPanel = this.enterPanel.bind(this);
    this.viewCardSet = this.viewCardSet.bind(this);
    this.viewCard = this.viewCard.bind(this);
  }

  enterPanel() {
    this.setState({
      view: "panel",
      name: "Card Set Panel",
    });
  }
  viewCardSet(cardSet) {
    this.setState({
      view: "cardset",
      name: cardSet.title,
      cset: cardSet,
    });
  }
  viewCard(card) {
    this.setState({
      view: "card",
      card: card,
    });
  };

  fetchPublicCardsets() {
    this.setState({
      fetching: true,
    });

    let cardsets = [];
    // fetch code
    fetch("https://localhost:5001/SLOTH/GetPublicCardSets")
            .then(response => response.json())
            .then(data => {
                this.setState({cardsets: data, fetching: false})
            })
            .catch(e => {
                this.setState({...this.state, fetching: false});
            });
  }
  fetchUserCardsets() {
    this.setState({
      fetching: true,
    });
    this.state.user.getCardSets();
    const cardsets = this.state.user.cardSet;
    // fetch code

    this.setState({
      fetching: false,
      cardsets: cardsets,
    });
  }
  fetchGroupCardsets() {
    this.setState({
      fetching: true,
    });

    let cardsets = [];
    // fetch code

    this.setState({
      fetching: false,
      cardsets: cardsets,
    });
  }

  componentDidMount() {

    switch (this.state.whose) {
      case "public":
        this.fetchPublicCardsets();
        break;

      case "private":
        this.fetchUserCardsets();
        break;

      case "group":
        this.fetchGroupCardsets();
        break;

      default:
    }
  }

  componentDidUpdate() {
  }

  openPanel() {
    let element;
    // console.log("Pozvana openPanel")

    // switch (this.state.whose) {
    //   case "public":
    //     cardsets = this.state.cardsets;
    //     break;

    //   case "private":
    //     console.log(this.state.user.cardSet);
    //     cardsets = this.state.user.cardSet;
    //     break;

    //   case "group":
    //     //  fali grupa u modelima.
    //     break;

    //   default:
    //     cardsets = [];
    // }

    if (this.state.cardsets.length > 0) {
      element = (
        <React.Fragment>
          <h1 className="display-3">{this.state.name}</h1>
          <h3>Rendering state: {this.state.view}</h3>
          <RenderCardsets openCardset={this.viewCardSet} cardsets={this.state.cardsets} />
        </React.Fragment>
      );
    } else {
      element = (
        <React.Fragment>
          <h1 className="display-3">Cardset Panel</h1>
          <div className="container">
            <p>
              Looks like there are no cardsets. You can maybe make your own
              cardset?
            </p>
          </div>
        </React.Fragment>
      );
      return element;
    }
  }
  openCardset() {
    let element = (
      <div>
        <h1 className="display-3">{this.state.cset.title}</h1>
        <h3>Rendering state: {this.state.view}</h3>
        <CycleCards whose="cards" cardset={this.state.cset.cards} />
        <button className="btn btn-primary" onClick={this.enterPanel}>
          Close Set
        </button>
      </div>
    );
    return element;
  }
  openCard() {
    let element = (
      <div>
        <h1 className="display-3">
          {this.state.cset.title}, card {this.state.card.id}
        </h1>
        <h3>Rendering state: {this.state.view}</h3>
        <CardView
          card={this.state.card}
          color={this.state.cset.color}
        />
        <button
          className="btn btn-primary"
          onClick={() => this.viewCardSet(this.state.cset)}
        >
          Close Card
        </button>
      </div>
    );
    return element;
  }

  render() {
    if(this.state.fetching) {
      return <h1>Fetching data...</h1>
    }

    let element = <p>Nešto ne valja.</p>;

      switch (this.state.view) {
        case "panel":
          element = this.openPanel();
          break;

        case "cardset":
          element = this.openCardset();
          break;

        case "card":
          element = this.openCard();
          break;

        default:
          element = <div>Nothing to render.</div>;
          break;
      }

    return element;
  }
}

export default CardSetPanel;
