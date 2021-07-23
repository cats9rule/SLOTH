import ListGroup from "react-bootstrap/ListGroup";
import React from "react";

const RenderNotes = (props) => {

  let notes = null;
    if (props.notes.length === 0) {
      notes = <p>This notebook has no notes.</p>;
    } else
      notes = props.notes.map((n) => {
        return (
          <ListGroup.Item
            key={n.id}
            variant="light"
            action
            onClick={() => props.viewNote(n)}
          >
            {n.title}
          </ListGroup.Item>
        );
      });

  return <ListGroup>{notes}</ListGroup>
};

export default RenderNotes;