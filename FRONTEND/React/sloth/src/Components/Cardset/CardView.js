import React, { Component } from "react";
import "../../styles/card.css";

/**
 * KOMPONENTA CARDVIEW:
 *
 * Komponenta prikazuje jednu karticu. Služi samo za prikaz kartice.
 * Poziva se u CYCLECARDS.
 * 
 * Kartica može da se obrće. Inicijalno je questionSide renderovan.
 * Klikom na karticu prikazuje se answerSide, i obrnuto.
 * ---------------------------------------------------------------------------------------------------------------------
 * PROPS:
 *   - card={card}
 *   - color={#hexValue}
 * ---------------------------------------------------------------------------------------------------------------------
 * STATE:
 *   - side: qnSide/answSide
 * ---------------------------------------------------------------------------------------------------------------------
 */

class CardView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      side: "qnSide",
      //animation: props.animation
    };

    this.flipCard = this.flipCard.bind(this);
  }

  flipCard() {
    this.setState((prevState) => {
      if (prevState.side == "qnSide") {
        return {
          side: "answSide",
        };
      } else {
        return {
          side: "qnSide",
        };
      }
    });
  }

  componentDidUpdate(prevProps) {
    if(prevProps.card != this.props.card) {
      this.setState({side: "qnSide"});
    }

    // if(prevProps.animation != this.props.animation) {
    //   this.setState({animation: this.props.animation});
    // }
  }

  render() {
    let element;

    if (this.state.side === "qnSide") {
      element = (
        <div className={`card-div ${this.props.animation}`}>
          <button
            className={`card btn card-text flipper front`}
            style={{ backgroundColor: this.props.color }}
            onClick={this.flipCard}
          >
            <span className="front-span">{this.props.card.questionSide}</span>
          </button>
        </div>
      );
    } else {
      element = (
        <div className="card-div">
          <button
            style={{ backgroundColor: this.props.color }}
            className="card btn card-text flipper back"
            onClick={this.flipCard}
          >
            <span className="back-span">{this.props.card.answerSide}</span>
          </button>
        </div>
      );
    }
    return element;
  }
}

export default CardView;
