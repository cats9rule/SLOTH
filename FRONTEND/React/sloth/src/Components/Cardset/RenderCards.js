import React from "react";

const RenderCards = (props) => {

  const cards = props.cards;
  const items = cards.map((card) => (
    <div key={card.id}>
      <button
        className="btn"
        onClick={() => props.openCard(card)}
        style={{backgroundColor: props.color}}
      >
        {card.questionSide}
      </button>
    </div>
  ));

  return <div>{items}</div>;
};

export default RenderCards;