import React, { Component } from "react";
import "../../styles/studyplan.css";

/**
 * KOMPONENTA TIMER - sluzi za prikaz vremena 
 * Props:
 *  timerTime - vreme koje treba da se prikaze (u milisekundama)
 */
class Timer extends Component {

    constructor(props){
        super(props);

        this.state = {

        }
    }

    render(){

        
        return (
            <div>
                <span className = "digits hours">
                    {("0" + Math.floor(this.props.timerTime / 3600000)).slice(-2)}:
                </span>
                <span className = "digits minutes">
                {("0" + Math.floor((this.props.timerTime / 60000) % 60)).slice(-2)}:
                </span>
                <span className = "digits seconds">
                    {("0" + (Math.floor(this.props.timerTime / 1000) % 60)).slice(-2)}
                </span>
            </div>
        );
    }


}

export default Timer;