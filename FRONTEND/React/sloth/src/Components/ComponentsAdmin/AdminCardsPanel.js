import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import CardForm from "./CardForm";
import SearchBox from "../Cardset/SearchBox.js";
import { Card } from "../../Models/card";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

class AdminCardsPanel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            view: "default",
            action: "browse",
            cardsetid: this.props.cardsetid,
            color: this.props.color,
            cards: [],
            filteredCards: [],
            fetching: true,
            count: ""
        };

        this.setStateAction = this.setStateAction.bind(this);
        this.setFilteredCards = this.setFilteredCards.bind(this);
    }

    //#region StateSetting
    setStateAction(clicked) {
        switch(clicked)
        {
            case "create":
                this.setState({action: "create"});
                break;
            case "edit":
                this.setState({action: "edit"});
                break;
            default:
                this.setState({action: "browse"});
                this.fetchCards();
                break;
        }
    }

    setFilteredCards(cards) {
        this.setState({filteredCards: cards})
    }
    //#endregion

    //#region FetchFunction
    fetchCards() {
        this.setState({fetching:true});
        let cards = [];
        fetch("https://localhost:5001/SLOTH/GetCards/" + this.state.cardsetid)
            .then(response => response.json())
            .then(data => {
                data.forEach(c => {
                    let card = new Card(c.id, c.questionSide, c.answerSide);
                    cards.push(card);
                });
                this.setState({cards: cards, fetching:false, filteredCards: cards, count: cards.length});
            })
            .catch(e => {
                this.setState({...this.state, fetching:false});
            })
    }
    //#endregion

    componentDidMount() {
        this.fetchCards();
    }

    //#region Functions
    openFormForCreate() {
        return <CardForm setStateAction = {this.setStateAction}
                         action="create"
                         cardsetid = {this.state.cardsetid}>
                </CardForm>
    }

    openFormForEdit() {
        return <CardForm setStateAction = {this.setStateAction}
                         action="edit"
                         card = {this.state.cards[this.state.index]}>
                </CardForm>
    }

    editSelected(index) {
        this.setStateAction("edit");
        this.setState({index: index});
    }

    deleteSelected(index) {
        this.setState({index: index});
        const requestOptions = {
            method: "Delete",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(),
        };

        confirmAlert({
            title: 'Confirm to delete',
            message: 'You sure you want to delete?',
            buttons: [
              {
                label: 'Yup',
                onClick: async () => {
                    fetch("https://localhost:5001/SLOTH/DeleteCard/" + this.state.cards[index].id, requestOptions)
                        .then(response => {
                        if(response.ok) {
                            this.fetchCards();
                        }  
                        })
                    }
              },
              {
                label: 'Nope'
              }
            ]
          });

    }
    //#endregion

    //#region RenderFunctions
    renderTableHeader() {
        let header = Object.keys(this.state.cards[0]);
        return header.map((key, index) => {
            if (key.toUpperCase() === "ID") 
                return <th key = {index} style={{backgroundColor:"#a0a6b0"}}>{key.toUpperCase()}</th>
            else
                return <th key = {index}>{key.toUpperCase()}</th>
        })
    }

    renderTableData() {
        return this.state.filteredCards.map((card, index) => {
            const {id, questionSide, answerSide} = card;
            return (
                <tr>
                    <td style={{backgroundColor:this.state.color}}>{id}</td>
                    <td>{questionSide}</td>
                    <td>{answerSide}</td>
                    <td>{this.state.cardsetid}</td>
                    <td><Button variant="primary" onClick={() => this.editSelected(index)}>Edit</Button></td>
                    <td><Button variant="danger" onClick={() => this.deleteSelected(index)}>Delete</Button></td>
                </tr>
            )
        })
    }

    renderBrowse() {
        let element;
        if (this.state.fetching) {
            element = <h3>We are getting cards ready wait a bit</h3>;
        }
        else
        {
            if(this.state.cards.length === 0)
            {
                element = 
                <div>
                    <div>
                        <h3>Chosen Cardset does not have cards. Why not create one?</h3> 
                        <Button variant="primary" onClick={() => this.setStateAction("create")}>Create Card</Button>
                    </div>
                    <div>
                        <h3>To go back to Admin Cardsets Panel select Go Back option</h3>
                        <Button variant="primary" onClick={this.props.setStateAction}>Go back</Button>
                    </div>
                </div>
            }
            else
            {
                element = 
                <div>
                    <h3>All Cards for selected Cardset</h3>
                    <h5>Currently count of Cards in database for Selected Cardset is: {this.state.count}</h5>
                    <h5>To Filter Data use SearchBox</h5>
                    <SearchBox array={this.state.cards} type="cards" sendResults={this.setFilteredCards}></SearchBox>
                    <Table striped bordered hover size="sm" responsive="md" id = "mmessages">
                        <tbody>
                            <tr>
                               {this.renderTableHeader()}
                               <th key = "cardsetid">CardSet ID</th>
                               <th key = "options" colSpan="3">Options</th>
                            </tr>
                            {this.renderTableData()}
                        </tbody>
                    </Table>
                    <div align="left">
                        <h4>To create new Card select Create option</h4>
                        <Button variant="primary" onClick={() => this.setStateAction("create")}>Create Card</Button>
                    </div>
                    <div align="left">
                        <h4>To go back to Admin Cardsets Panel select Go Back option</h4>
                        <Button variant="primary" onClick={this.props.setStateAction}>Go back</Button>
                    </div>
                </div>
            }
        }
        return element;
    }

    render() {
        let element;
        switch(this.state.action) {
        case "browse":  
            element = this.renderBrowse();
            break;
        case "edit":
            element = this.openFormForEdit();
            break;
        case "create":
            element = this.openFormForCreate();
            break;
        default:
            element = <div>Error: this.state.view is not valid.</div>;
            break;
        }
    
        return element;
    }
    //#endregion
}

export default AdminCardsPanel;