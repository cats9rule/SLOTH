import React from "react";
import Dropdown from 'react-bootstrap/Dropdown';

import "../../styles/notebook.css"
import "../../styles/materialview.css";

export default function NotebookInfo(props) {

  let tags = null;
  if (props.notebook.tags != null) {
    tags = props.notebook.tags.map((tag, index) => 
      (<li key={index}>{tag}</li>)
    );
  }

  return (
    <React.Fragment>
        <div className="container-fluid infobox display-big">
        <h5>{props.notebook.title}</h5>
      <h6>Notes in notebook: {props.notes.length}</h6>
      <h6>Category: {props.notebook.category.name}</h6>
      <h6>Tags: </h6>
      <ul>{tags}</ul>
        </div>
        <div className="container-fluid infobox display-small" >
        <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
           Notebook Info
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.ItemText>
          <h5>{props.notebook.title}</h5>
      <h6>Notes in notebook: {props.notes.length}</h6>
      <h6>Category: {props.notebook.category.name}</h6>
      <h6>Tags: </h6>
      <ul>{tags}</ul>
        </Dropdown.ItemText>
        </Dropdown.Menu>
       </Dropdown>
       </div>
       </React.Fragment>
  );
}
