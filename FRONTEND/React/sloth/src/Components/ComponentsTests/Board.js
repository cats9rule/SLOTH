import React, { Component } from "react";
import {Card} from "../../Models/card.js";
import { Button } from "@material-ui/core";
import MemoryCard from "./MemoryCard";
import "../../styles/memo.css";
import { keys } from "@material-ui/core/styles/createBreakpoints";
import { getDefaultNormalizer } from "@testing-library/dom";
/**
 * KOMPONENTA BOARD
 * 
 * Props:
 *  - cardSetsIDs 
 *  - numberOfCards
 *  - pairFound - f-ja koja u nadkomponenti NewMemoryGame inkrementira broj pronadjenih parova
 *  - setStatusCode - f-ja koja u nadkomponenti NewMemoryGame setuje kod koji vrati server,
 *                    kako bi se u slucaju greske renderovala poruka
 * 
 * State:
 *  - fetching
 *  - firstKey
 *  - secondKey
 *  - numberOfClicks :
 *           0 - nijedna kartica nije okrenuta
 *           1 - okrenuta prva kartica i zapamcen firstKey
 *           2 - okrenute 2 kartice, zapamcen secondKey i treba proveriti da li su matched
 *  
 */

class Board extends Component {
    constructor(props){
        super(props);

        this.memoryCards = [];

        this.state = {
            fetching: true,
            cards: [],
            firstKey: undefined,
            secondKey: undefined,
            numberOfClicks: 0,
            statusCode: 200,
        }

        this.onClick = this.onClick.bind(this);
        
    }

    //#region Methods
    onClick(pair, index){
        if(this.state.numberOfClicks === 1){

            //flip card

            this.memoryCards[index].flipped = true;
            this.memoryCards[index].default = false;

            this.setState({
                secondKey: index,
                numberOfClicks: 2
            });

            //provera da li su matched
            if(pair === this.memoryCards[this.state.firstKey].pair)
            {
                //matched

                setTimeout(() => {
                    this.memoryCards[index].matched = true; // druga kliknuta kartica
                    this.memoryCards[this.state.firstKey].matched = true;
    
                    this.setState({
                        firstKey: undefined, 
                        secondKey: undefined,
                        numberOfClicks: 0,
        
                    });
                   
                   
                    this.props.pairFound();
    
    
                }, 2000);
               
            }
            else {
                this.timeout = setTimeout(() => {
                    this.clearCards(this.state.firstKey, this.state.secondKey);
                }, 2000);
            }
        }
        else
        {
            this.memoryCards[index].flipped = true;
            this.memoryCards[index].default = false;
            
            if(this.state.numberOfClicks === 2){
                clearTimeout(this.timeout);
                // this.clearCards(this.state.firstKey, this.state.secondKey);

            }

            
            this.setState({
                firstKey: index,
                numberOfClicks: 1
                
            });

            
        }
    }

    clearCards(index1, index2)
    {
        if(this.state.numberOfClicks !== 2){
            return;

        }
        
        this.memoryCards[index1].flipped = false;
        this.memoryCards[index1].default = true;
        this.memoryCards[index2].flipped = false;
        this.memoryCards[index2].default = true;

        this.setState({
            firstKey: undefined,
            secondKey: undefined,
            numberOfClicks: 0,

        });
    }

    generateMemoryCards(){
        this.state.cards.forEach((element, index) => {

            //Za svaku karticu se kreira par question/answer sa istim kljucem
            const memoryCard1 = {
                pair: index,
                content: element.questionSide,
                default: true,
                flipped: false,
                matched: false,
                
            };

            this.memoryCards.push(memoryCard1);

            const memoryCard2 = {
                pair: index,
                content: element.answerSide,
                default: true,
                flipped: false,
                matched: false,
            };
            
            this.memoryCards.push(memoryCard2);
        });

        //shuffle

        for(let i = this.memoryCards.length - 1; i > 0; i--){
            let j = Math.floor(Math.random() * i);
            let temp = this.memoryCards[i];
            this.memoryCards[i] = this.memoryCards[j];
            this.memoryCards[j] = temp;
        }

    }

    //#endregion

    fetchCards() {
        this.setState({
            fetching: true,

        });

        let cards = [];


        fetch("https://localhost:5001/SLOTH/MemoryGameGenerator/" + this.props.numberOfCards, {
            method: "PUT",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "ids": this.props.cardSetIDs
            })
        }).then(p =>{
            if(p.ok){

                p.json().then(data => {
                    data.forEach(card => {
                        let newCard = new Card(card.id, card.questionSide, card.answerSide);
                        //atributi za boju, visibility i category nisu setovani
                        this.props.start();
                        cards.push(newCard);
                    });
                    this.setState({cards: cards, fetching: false});
                })
                .catch(e => {
                    console.log(e);
                    this.setState({...this.state, fetching:false});
                });
            }
            else if(p.status === 405){
                this.props.setStatusCode(405);
            }
            else if(p.status === 406){
                this.props.setStatusCode(406);
            }
        })
    }

    componentDidMount(){
        this.fetchCards();
    }

    componentDidUpdate(prevProps)
    {
        if(prevProps.cardSetIDs !== this.props.cardSetIDs)
        {
            this.setState({
                fetching: true,
                statusCode: 200,
                numberOfClicks: 0,
                card:[],
                start: false,
            });
            this.fetchCards();
        }

    }





    render(){
        if(this.memoryCards.length === 0)
            this.generateMemoryCards();

        if(this.state.fetching){
            return <h1>Fetching data...</h1>
        }
        // if(this.state.statusCode === 405)
        // {

        //     return <h1>405</h1>;
        // }
        // else if(this.state.statusCode === 406)
        // {
        //     return <h1>406</h1>;
        // }

        const items = this.memoryCards.map((card, index) => (
            
            
            <MemoryCard avatar = {this.props.avatar} key={index} numberOfCards = {this.props.numberOfCards} numberOfClicks = {this.state.numberOfClicks} 
                    pair = {card.pair} onClick = {this.onClick} content = {card.content} 
                    matched = {card.matched} default = {card.default} flipped = {card.flipped} index = {index}>

            </MemoryCard>

            
        ));
        // return <div className="board">
        //     {this.state.fetching}
            return <div className="cards">{items}</div>
        // </div>
    }
}

export default Board;