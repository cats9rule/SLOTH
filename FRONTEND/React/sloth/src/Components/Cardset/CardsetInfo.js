import React from 'react'
import Dropdown from 'react-bootstrap/Dropdown';

import "../../styles/global.css";
import "../../styles/materialview.css";

/**
 * KOMPONENTA CARDSETINFO (function component)
 * 
 * Služi da renderuje osnovne informacije o špilu.
 * ---------------------------------------------------------------------------------------------------------------------
 * PROPS:
 *   - cardset - prosleđeni špil
 * ---------------------------------------------------------------------------------------------------------------------
 */

export default function CardsetInfo(props) {

    let tags = null;
    if(props.cardset.tags != null) {
        tags = props.cardset.tags.map((tag, index) => 
        (
            <li key={index}>{tag}</li>
        )
    );
    }

    let colourString = props.cardset.color.slice(0, 7);
    colourString += "33";

    return (
        <React.Fragment>
        <div className="container-fluid infobox display-big" style={{ backgroundColor: colourString }}>
        <h5>{props.cardset.title}</h5>
            <h6>Cards in set: {props.noOfCards}</h6>
            <h6>Color: <span display="inline" style={{ backgroundColor: props.cardset.color }}>{props.cardset.color}</span></h6>
            <h6>Category: {props.cardset.category.name}</h6>
            <h6>Tags: </h6>
            <ul>{tags}</ul>
        </div>
        <div className="container-fluid infobox display-small" >
        <Dropdown>
        <Dropdown.Toggle size="sm" variant="outline-black" id="dropdown-basic" style={{ backgroundColor: colourString }}>
           Cardset Info
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.ItemText>
            <h5>{props.cardset.title}</h5>
            <h6>Cards in set: {props.noOfCards}</h6>
            <h6>Color: <span display="inline" style={{ backgroundColor: props.cardset.color }}>{props.cardset.color}</span></h6>
            <h6>Category: {props.cardset.category.name}</h6>
            <h6>Tags: </h6>
            <ul>{tags}</ul>
        </Dropdown.ItemText>
        </Dropdown.Menu>
       </Dropdown>
       </div>
       </React.Fragment>
    )
}