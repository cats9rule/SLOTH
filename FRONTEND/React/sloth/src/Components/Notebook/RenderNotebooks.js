import React from "react";
import ListGroup from "react-bootstrap/ListGroup";

/**
 * KOMPONENTA RENDERNOTEBOOKS (functional component):
 * 
 * Komponenta za prikaz svih Notebookova.
 * Poziva se u NOTEBOOKPANEL.
 * ---------------------------------------------------------------------------------------------------------------------
 * PROPS:
 *   - notebooks - niz cardsetova
 *   - openNotebook - funkcija za otvaranje seta (iz NotebookPanela).
 * ---------------------------------------------------------------------------------------------------------------------
 */

const RenderNotebooks = (props) => {

    // TODO: rešiti stil (margin, padding...)
  
  const items = props.notebooks.map((notebook) => {
    return(
      <ListGroup.Item
        key={notebook.id}
        variant="info"
        action
        onClick={() => props.openNotebook(notebook)}
      >
        {notebook.title}
      </ListGroup.Item>
  )});

  return <ListGroup>{items}</ListGroup>;
};

export default RenderNotebooks;