import React, { Component } from "react";
import NewMemoryGame from "./NewMemoryGame";
import NewTest from "./NewTest";
import {CardSet} from "../../Models/cardSet.js";
import "../../styles/global.css";

/**
 * KOMPONENTA TESTPANEL
 * 
 * Props:
 *  - user : this.props.user -> korisnik koji je ulogovan
 * 
 * State:
 *  - view : panel/test/memorygame
 *  
 * 
 */
class TestPanel extends Component {
    constructor(props) {
        super(props);
        this.user = this.props.user;
        this.state = {
            view: "panel",
            fetching: true,
        };

        // this.user.getCardSets();

        this.selectedCardSets = [];

        this.enterPanel = this.enterPanel.bind(this);
        this.createTest = this.createTest.bind(this);
        this.createMemoryGame = this.createMemoryGame.bind(this);
        this.removeCardSetID = this.removeCardSetID.bind(this);
        this.addCardSetID = this.addCardSetID.bind(this);
    }
    //#region changeStateMethods
    enterPanel(){
        this.setState({
            view: "panel",
            name: "Test Panel",
        });
    }
    createTest(){
        this.setState({
            view: "test",
            name: "New Test Panel",
        });
    }

    createMemoryGame(){
        this.setState({
            view:"memorygame",
            name:"New Memory Game"
        });
    }
    //#endregion

    fetchUserCardSets(){
        this.setState({
            fetching: true,

        });

        let cardsets = [];

        fetch("https://localhost:5001/SLOTH/GetCardSets/" + this.props.user.id)
                .then(response => response.json())
                .then(data => {
                    data.forEach(cs => {                       
                        let newCardSet = new CardSet(cs.cardSet.id, cs.cardSet.title, cs.cardSet.color, cs.cardSet.tags);
                        newCardSet.setVisibility(cs.cardSet.visibility);
                        newCardSet.setCategory(cs.cardSet.category);
                        if(!cardsets.includes(newCardSet))
                            cardsets.push(newCardSet);
                    });
                    this.setState({cardsets: cardsets, fetching:false});
                    
                })
                .catch(e => {
                    console.log(e);
                    this.setState({...this.state, fetching:false});
                })
    }

    //#region Methods
    addCardSetID(cardSetID)
    {
        if(!this.selectedCardSets.includes(cardSetID))
            this.selectedCardSets.push(cardSetID);
    }

    removeCardSetID(cardSetID)
    {
        for(let i=0;i<this.selectedCardSets.length;i++)
        {
            if(this.selectedCardSets[i] === cardSetID)
                this.selectedCardSets.splice(i,1);
        }

    }

    emptySelectedCardSets = () => {
        while(this.selectedCardSets.length > 0)
            this.selectedCardSets.pop();
    }
    //#endregion

    //#region renderMethods
    openNewTest(){

        let element = (
            <div>
                <NewTest goBack = {this.enterPanel} emptySelectedCS = {this.emptySelectedCardSets} addCardSetID = {this.addCardSetID} removeCardSetID = {this.removeCardSetID} cardsets = {this.state.cardsets} selectedCardSets = {this.selectedCardSets}></NewTest>
            </div>
        );

        return element;
    }

    openNewMemoryGame(){
        let element = (
            <div>
                <NewMemoryGame avatar = {this.props.user.avatar} emptySelectedCS = {this.emptySelectedCardSets} goBack = {this.enterPanel} 
                    addCardSetID = {this.addCardSetID} removeCardSetID = {this.removeCardSetID} 
                    cardsets = {this.state.cardsets} selectedCardSets = {this.selectedCardSets}></NewMemoryGame>
            </div>
        );
        return element;
    }

    openPanel()
    {
        this.emptySelectedCardSets();
        
        let element = (        
        <React.Fragment>
            <h1>Testing</h1>
            <div className = "test-options d-flex flex-row container">
                <div className="col-6">
                <button className="btn btn-lg  btn-outline-dark test-option btn-block btn-responsive"
                    onClick={this.createTest}>New Test</button>
                </div>
                <div className="col-6">
                <button className="btn btn-lg  btn-outline-dark test-option btn-block btn-responsive"
                    onClick={this.createMemoryGame}>New Memory Game</button>
                </div>
            </div>
        </React.Fragment>);
        return element;
    }
    //#endregion

    componentDidMount(){
        
        this.fetchUserCardSets();
    }
    render() {
        let element;

        switch (this.state.view) {
            case "panel":
                element = this.openPanel();
                break;
            case "test":
                element = this.openNewTest();
                break;
            case "memorygame":
                element = this.openNewMemoryGame();
                break;

            default:
                element = <div>Nothing to render.</div>;
                break;

        }

        return element;
    }
}

export default TestPanel;