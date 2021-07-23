import { Button } from "@material-ui/core";
import React, { Component } from "react";


/*
* KOMPONENTA CARDSETBUTTON
* 
* Komponenta za prikaz CardSetova u obliku dugmica
*
* PROPS:
*   - CardSet - jedan cardset
    - addCardSetID  - funkcija za dodavanje cardseta u niz izabranih
    - removeCardSetID - funkcija za izbacivanje cardseta iz niza izabranih
    - 
*/


class CardSetButton extends Component {
  constructor(props) {
    //prosledjuje se cardSet kao props
    super(props);

    this.state = {
      selected: "false",
      color: "btn btn-outline-dark",
    };

    this.selectCardSet = this.selectCardSet.bind(this);
  }

  selectCardSet() {
    if (this.state.selected === "false") {
      this.setState({
        selected: "true",
        color: "btn btn-dark", //random boja
      }, () => this.props.addCardSetID(this.props.cardSet.id));
    } else if (this.state.selected === "true") {
      this.setState({
        selected: "false",
        color: "btn btn-outline-dark", //random boja 2
      }, () => this.props.removeCardSetID(this.props.cardSet.id));
    }
  }

  render() {

    return (
      <React.Fragment>

        <button type="button"
        className={this.state.color}
        onClick={this.selectCardSet}
        >
          <b>Name of set:</b> {this.props.cardSet.title} <br />
          <b>Category:</b> {this.props.cardSet.category.name}  <br />
          
        </button>
      </React.Fragment>
    );
  }
}

export default CardSetButton;
