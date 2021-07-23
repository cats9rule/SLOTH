import React, { Component } from "react";
import Timer from "./Timer";

/**
 * KOMPONENTA STOPWATCH
 * 
 * Props: 
 *  start - true/false -> ukoliko se kroz props prosledi start=true, stopwatch se pokrece odmah
 *                          (nije potrebno dugme za start)
 *  stop - true/false -> mozda nije potrebno
 *  setTime (timerTime) -> prosledjuje se trenutno vreme nadkomponenti
 *                         kako bi moglo i u nadkomponenti da se procita vreme
 * State:
 *  timerOn - true/false
 *  timerStart
 *  timerTime
 */
class Stopwatch extends Component{

    constructor(props){
        super(props);

        this.state = {

            timerOn: false,
            timerStart: 0,
            timerTime: 0
        }

        this.startTimer = this.startTimer.bind(this);
        this.stopTimer = this.stopTimer.bind(this);
        this.resetTimer = this.resetTimer.bind(this);
        
    }

    componentDidMount(){

        if(this.props.start){
            this.startTimer();
        }
        else if (this.props.stop){
            this.stopTimer();
        }

        
    }

    componentDidUpdate(prevProps, prevState){
        if(prevProps.start !== this.props.start)
        {
            if(this.props.start)
                this.startTimer();
            if(this.props.stop)
                this.stopTimer();
        }
     }

    componentWillUnmount(){
        clearInterval(this.timer);
    }


    startTimer(){
        this.setState({
            timerOn:true,
            timerTime: this.state.timerTime,
            timerStart: Date.now() - this.state.timerTime
        });

        this.timer = setInterval(() => {
            this.setState({
                timerTime: Date.now() - this.state.timerStart,

            }, () => this.props.setTime(this.state.timerTime));
            
        }, 10);
    }

    stopTimer() {
        this.setState({ timerOn: false});
        clearInterval(this.timer);
    }

    resetTimer() {
        this.setState({
            timerStart: 0,
            timerTime: 0
        });
    }

    render() {
        return (
            <div>
                <Timer timerTime = {this.state.timerTime}></Timer>
            </div>
        );
    }


}

export default Stopwatch;