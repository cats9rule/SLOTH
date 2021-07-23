import React from "react";
import ListGroup from "react-bootstrap/ListGroup";
/**
 * KOMPONENTA RENDERCARDSETS (functional component):
 * 
 * Komponenta za prikaz svih CardSetova.
 * Poziva se u CARDSETPANEL.
 * ---------------------------------------------------------------------------------------------------------------------
 * PROPS:
 *   - cardsets - niz cardsetova
 *   - openCardset - funkcija za otvaranje seta (iz CardsetPanela).
 * ---------------------------------------------------------------------------------------------------------------------
 */

const RenderCardsets = (props) => {

    // TODO: rešiti stil (margin, padding...)
  
  const items = props.cardsets.map((cardset) => (
      <ListGroup.Item
        key={cardset.id}
        action
        variant="dark"
        onClick={() => props.openCardset(cardset)}
        style={{backgroundColor: cardset.color}}
      >
        {cardset.title} <br />
        <b>Category:</b> {cardset.category.name}  <br />
      </ListGroup.Item>
  ));

  return <ListGroup>{items}</ListGroup>;
};

export default RenderCardsets;
