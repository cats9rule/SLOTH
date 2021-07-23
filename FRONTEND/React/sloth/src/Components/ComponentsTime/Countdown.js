import React, { Component } from "react";
import Timer from "./Timer.js";

/**
 * KOMPONENTA COUNTDOWN
 * 
 * Props:
 *  start - true/false -> ukoliko se kroz props prosledi start=true, countdown se pokrece odmah
 *                          (nije potrebno dugme za start)
 *  startTime - od koje vrednosti pocinje da se odbrojava
 *              (koristi se i kad treba resetovati timer)
 * 
 *  theEnd - fja za obavestavanje nadkomponente da je vreme isteklo
 * 
 * State:
 *  timerOn - true/false
 *  timerStart
 *  timerTime
 */
class Countdown extends Component {

    constructor(props){
        super(props);

        this.state = {
            timerOn: false,
            timerStart: 0,
            timerTime: this.props.startTime,
        }
        
        this.startTime = this.props.startTime;

        this.startTimer = this.startTimer.bind(this);
        this.stopTimer = this.stopTimer.bind(this);
        this.resetTimer = this.resetTimer.bind(this);

    }

    startTimer(){
        this.setState({
            timerOn: true,
            timerTime: this.state.timerTime,
            timerStart: this.state.timerTime

        });

        this.timer = setInterval(() => {
            const newTime = this.state.timerTime - 10;
            if (newTime >= 0){
                this.setState({
                    timerTime: newTime
                });
            }
            else {
                clearInterval(this.timer);
                this.setState({ timerOn: false }, () => this.props.theEnd());

            }
        }, 10);
    }

    stopTimer(){

        clearInterval(this.timer);
        this.setState({timerOn: false});
    }

    resetTimer(){
        if(this.state.timerOn === false)
        {
            this.setState({
                timerTime: this.startTime,
            });
        }
    }
 
    componentDidMount(){
 
        if(this.props.start)
        {
            this.setState({
                startTimer: this.props.startTime,

            },  this.startTimer());
           
        }
    }

    componentDidUpdate(prevProps, prevState){
       if(prevProps.startTime !== this.props.startTime)
       {
           clearInterval(this.timer);
           this.setState({
                timerOn: false,
                timerStart: 0,
                timerTime: this.props.startTime
           });
       }
       if(prevProps.start !== this.props.start)
       {
           this.setState({
                timerOn: false,
                timerStart: 0,
                timerTime: this.props.startTime
           });
       }
    }

    componentWillUnmount(){
       clearInterval(this.timer);
    }
    render(){
        return (
            <div>
                <Timer timerTime = {this.state.timerTime}></Timer>
               
                {this.state.timerOn === false && (this.state.timerStart === 0 || this.state.timerTime === this.state.timerStart) 
                && (<button className="btn btn-outline-dark" onClick = {this.startTimer}>Start</button>)}

                { this.state.timerOn === true && this.state.timerTime >= 1000 
                    && (<button className="btn btn-outline-dark" onClick = {this.stopTimer}>Stop</button>)}

                
                { this.state.timerOn === false && (this.state.timerStart !== 0 && this.state.timerStart !== this.state.timerTime && this.state.timerTime !== 0)
                    && (<button className="btn btn-outline-dark" onClick={this.startTimer}>Resume</button>)}

                {(this.state.timerOn === false || this.state.timerTime < 1000) 
                    && (this.state.timerStart !== this.state.timerTime && this.state.timerStart > 0)
                        &&  (<button className="btn btn-outline-dark" onClick = {this.resetTimer}>Reset</button>)}               
            </div>
        );
    }
}

export default Countdown;