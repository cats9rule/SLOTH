import React, { Component } from "react";
import DisplayCardSets from "./DisplayCardSets";
import Board from "./Board";
import Stopwatch from "../ComponentsTime/Stopwatch.js";
import Timer from "../ComponentsTime/Timer.js";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import CloseIcon from '@material-ui/icons/Close';
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";


/**
 * KOMPONENTA NEWMEMORY GAME
 * 
 * Props:
 *  - goBack -> f-ja koja se vraca na testPanel prilikom klika na Cancel
 *  - addCardSetID -> f-ja koja dodaje id cardseta ako je selektovan 
 *          (ovde se ne koristi, samo se prosledjuje)
 *  - removeCardSetID -> f-ja koja brise id cardseta iz niza
 *          (ovde se ne koristi, samo se prosledjuje)
 *  - cardsets -> korisnikovi spilovi 
 *  - selectedCardSets -> IDs selektovanih spilova
 *  - emptySelectedCS -> f-ja koja brise sve selektovane spilove
 * 
 * State:
 *  - numberOfCards -> broj kartica za kreiranje igre
 */
class NewMemoryGame extends Component {
    constructor(props) {
        super(props);

       
        this.cardsets = this.props.cardsets;

        this.time = 0;

        this.state = {
           numberOfCards: "12",
           view: "creating",
           pairsFound: 0, 
           statusCode: 200,
           start:false,



        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleQuit = this.handleQuit.bind(this);
        this.setTime = this.setTime.bind(this);
        this.pairFound = this.pairFound.bind(this);
        this.setStatusCode = this.setStatusCode.bind(this);
        this.backToCreating = this.backToCreating.bind(this);
        this.start = this.start.bind(this);

    }

    handleChange(event){
        this.setState({numberOfCards: event.target.value});
    }

    handleSubmit(event){
        this.setState({
            view: "memorygame",
        })

        event.preventDefault();
    }
    setTime(time){
        this.time = time;
    }
    handleQuit(){

        confirmAlert({
            title: 'Confirm to quit',
            message: 'You sure you want to quit?',
            buttons: [
              {
                label: 'Yup',
                onClick: () => {
                    this.setState({
                        view: "quit",
                    })
                }
              },
              {
                label: 'Nope'
              }
            ]
        });

        
    }
    setStatusCode(code){
        this.setState({
            statusCode: code,
        })
    }

    pairFound(){
        this.setState(prevState => {
            return {pairsFound: prevState.pairsFound + 1} 
        })
    }
    backToCreating(){
        this.props.emptySelectedCS();
        this.setState({
            statusCode: 200,
            view: "creating",
        })
    }
    start()
    {
        this.setState({
            start: true,
        });
    }
    memoryGame(){
        let element = <div className="game-div">
            <div className=" d-flex flex-row justify-content-between mt-2 mb-4">
                <div className="col-6 d-flex justify-content-start">
                    <Stopwatch setTime={this.setTime} start={this.state.start} stop={false}></Stopwatch>
                </div>
                <div className="col-6">
                    <button onClick={this.handleQuit} className="btn btn-danger">Quit</button>
                </div>
            </div>
                <Board avatar = {this.props.avatar} setStatusCode = {this.setStatusCode} pairFound = {this.pairFound}
                     cardSetIDs = {this.props.selectedCardSets} numberOfCards = {this.state.numberOfCards}
                     start = {this.start}></Board>
        </div>
        return element;
    }

    error405(){
        let element = <div>

            <h1>Selected cardsets don't have enough cards for memory game.</h1>
            <button className="btn btn-primary" onClick={this.backToCreating}>Cancel</button>

        </div>

        return element;
    }
    quit(){

        let element = <div>
            
            <h1>You were almost there!</h1>
            <div className="d-flex flex-row justify-content-center">
                <h4 className="mr-3">Time taken:</h4>
                <Timer timerTime={this.time}></Timer>
            </div>
            <button className="btn btn-success" onClick={this.props.goBack}>OK</button>

        </div>

        return element;
    }

    theEnd(){

        let element = <div>
            <h1>Well Done!</h1>
            <div>
                <h4 className="mr-3">Time taken:</h4>
                <Timer timerTime={this.time}></Timer>
            </div>
            <button className="btn btn-success" onClick={this.props.goBack}>OK</button>
        </div>
        return element;
    }

    cancel= (event) => {
        //event.prevetnDefault();
        confirmAlert({
            title: 'Confirm to cancel',
            message: 'You sure you want to cancel?',
            buttons: [
              {
                label: 'Yup',
                onClick: () => {
                    this.props.goBack();
                }
              },
              {
                label: 'Nope'
              }
            ]
        });
    }

    creatingMemoryGame(){

        if(this.props.cardsets.length === 0)
        {
            return (<div className="container">
                <h4>There are no cardsets available.</h4>
            </div>)
        }
        let element = (<div>
            <h4>New Memory Game</h4>
            
            <Form className="container">
                <Form.Group as = {Row} className="justify-content-center">
                <Form.Label sm={3} className="align-bottom">Number of cards:</Form.Label>
                <Col sm={9} className="d-flex">
                <select className="form-select" value={this.state.numberOfCards} onChange={this.handleChange}>
                    <option value="12">12</option>
                    <option value="16">16</option>
                    <option value="20">20</option>

                </select>
                </Col>

            </Form.Group>
            
            <DisplayCardSets addCardSetID = {this.props.addCardSetID} removeCardSetID = {this.props.removeCardSetID} cardsets = {this.cardsets}></DisplayCardSets>
            
            <div className="d-flex flex-row justify-content-end">
                <button className="btn btn-success" onClick = {this.handleSubmit}>Submit</button>
                <button className="btn btn-danger" onClick = {(event) => {event.preventDefault(); this.cancel()}}>Cancel</button>
                {/*<button className="btn btn-danger" onClick = {this.props.goBack}>Cancel</button>*/}
            </div>
            </Form>
            </div>);
        
        return element;
    }
    render()
    {
        let element;
        
        if((this.state.pairsFound * 2) === parseInt(this.state.numberOfCards))
        {
            //kraj igre
            element = this.theEnd();

            return element;
        }

        if(this.state.statusCode === 405)
        {
            return this.error405();
        }
        if(this.state.statusCode === 406)
        {
            return this.error406();
        }
        switch (this.state.view)
        {
            case "creating":
                element = this.creatingMemoryGame();
                break;
            case "memorygame":
                element = this.memoryGame();
                break;
            case "quit":
                element = this.quit();
                break;
            default:
                element = <div>Nothing to render.</div>
                break;
        }

        return element;
    }
}

export default NewMemoryGame;