import React, {Component} from "react";
import CardSetButton from "./CardSetButton.js"

/**
 * KOMPONENTA DISPLAYCARDSETS
 * 
 * Komponenta za selekciju CardSetova za kreiranje testa i memory game
 * 
 * PROPS:
 *  - cardsets - niz cardsetova
 *  
 */

class DisplayCardSets extends Component {
    constructor(props){
        super(props);
        this.state = {
            
        };

  
    }



    render(){
        let items;
        if (this.props.cardsets.length === 0)
            items = <div>There are no cardsets to display.</div>
        else {
            items = this.props.cardsets.map((cardset) => (
                <div className="col-lg-4 col-md-4 col-sm-6 col-xs-6" key={cardset.id}>
                <CardSetButton cardSet = {cardset} addCardSetID = {this.props.addCardSetID} removeCardSetID = {this.props.removeCardSetID}>
                    
                </CardSetButton>
                </div>
            ));
            }

        return (<div className="d-flex flex-row flex-wrap">
            {items}
        </div>);
    }
}

export default DisplayCardSets;