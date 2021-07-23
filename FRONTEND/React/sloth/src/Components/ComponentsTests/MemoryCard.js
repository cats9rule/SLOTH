import React, { Component } from 'react';
import "../../styles/memo.css";
import Avatar from "./../../Models/avatar.js"
import Image from "react-bootstrap/Image"


/**
 * KOMPONENTA MEMORYCARD
 * 
 * Props:
 *  - pair -> par question/answer ima istu oznaku za par
 *  - content -> question / answer
 *  - onClick(key) -> f-ja koja se poziva prilikom klika na karticu i prosledjuje
 *                    se key 
 *  - flipped 
 *  - matched
 *  - default -> bukvalno ne treba, ali kao ajde stavili smo u dijagramu
 *  - index -> pozicija u nizu
 *  - numberOfClicks -> ukoliko je broj kliknutih kartica 2, ne moze se vise otvoriti nijedna kartica
 * 
 * 
 * State:

 */
class MemoryCard extends Component {
    constructor(props){
        super(props);

        this.flipCard = this.flipCard.bind(this);
        this.avatar = new Avatar();
    };

    flipCard(){
        if(this.props.numberOfClicks === 2)
        return;

        if(!this.props.matched && !this.props.flipped)
            this.props.onClick(this.props.pair, this.props.index);



    }
    render(){

        let number = 400/this.props.numberOfCards;
        
        let element;
        if(this.props.matched)
        {
            element = <div className = "memocard matched flipper"  style={{height: number + '%'}}>
                <button 
                    className="btn btn-memocard"
                    onClick = {this.flipCard}                
                >
            
                </button>
            </div>
            return element;
        }
        if(this.props.default)
        {
            element = 
                <div className="memocard default flipper" style={{height: number + '%'}}>
                
                <Image src={this.avatar.showAvatar(this.props.avatar)} rounded
                        className="btn btn-memocard"
                        onClick={this.flipCard}
                        />
                
                {/* <button
                    
                    className="btn btn-memocard"
                    onClick = {this.flipCard}                
                >
                    
                </button> */}
                </div>
            
        }
        else if(this.props.flipped)
        {
            
            element = 
            <div className="memocard flipped flipper"  style={{height: number + '%'}}>
            <button
                
                className="btn btn-memocard"
                      
            >
                <span className="content-span">{this.props.content}</span>
            </button>
            </div>
        }

        return element;
    }
}



export default MemoryCard;