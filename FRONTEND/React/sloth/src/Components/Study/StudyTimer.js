import React, {Component} from "react";
import Countdown from "../ComponentsTime/Countdown.js";
/**
 * KOMPONENTA STUDYTIMER
 *      za prikaz work/break time u status komponenti
 * 
 * 
 * State:
 *  type: work/break
 *  
 */

class StudyTimer extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            type: "work",
            time: this.props.workTime,

        }

        this.switchTime = this.switchTime.bind(this);
        this.setWorkTime = this.setWorkTime.bind(this);
        this.setBreakTime = this.setBreakTime.bind(this);
    }

    setWorkTime()
    {
        this.setState({
            type: "work",
            time: this.props.workTime,
        });
    }

    setBreakTime()
    {
        this.setState({
            type: "break",
            time: this.props.breakTime,
        });
    }

    switchTime()
    {

        if(this.state.type === "work")
        {
            this.setBreakTime();
        }
        else
        {
            this.props.theEnd();
        }
    }
    componentDidUpdate(prevProps, prevState)
    {
        if(prevProps.workTime !== this.props.workTime)
        {
            this.setState({
                type: "work",
                time: this.props.workTime,
            })
        }
        if(prevState.type !== this.state.type && prevState.type === "work")
        {
            this.setState({

                type: "break",
                time:this.props.breakTime,
            })
        }
    }

    render(){

        let element = null;
        let str="";
        let cntdown = null;
        let color = "#bfbfbf"
        switch(this.state.type)
        {
            case "work":
            str = "Work time";
            color = "#B4FC56"
            cntdown = <Countdown startTime={this.state.time} theEnd = {this.switchTime}></Countdown>
            break;

            case "break":
            str = "Break time";
            color = "#e6a7e9"
            cntdown = <Countdown startTime={this.state.time} theEnd = {this.switchTime} start={true}></Countdown>
            break;
        }
        element = <React.Fragment>
            <h6>{str}</h6>
            {/* <Countdown startTime={this.state.time} theEnd = {this.switchTime}></Countdown> */}
            {cntdown}
            </React.Fragment>

        return (<div style={{backgroundColor: color}}>{element}</div>);
    }
}

export default StudyTimer;