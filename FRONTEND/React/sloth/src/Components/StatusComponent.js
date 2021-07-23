import React, { Component } from 'react'
import Invites from "./Groups/Invites/Invites.js";
import StudyTimer from "./Study/StudyTimer.js";
import MotivationalMessagesController from "./MotivationalMessagesController.js";
import Toast from 'react-bootstrap/Toast';
import { ToastHeader } from 'react-bootstrap';

// TODO Dodati komponente koje treba renderovati (ne znam da li je MMController lepo ubačen pls edit)


/**
 * KOMPONENTA STATUSCOMPONENT
 * 
 * Komponenta renderuje MotivationalMessage, InviteBox i StudySession timer.
 * ---------------------------------------------------------------------------------------------------------------------
 * Props:
 *   - isStudying: true/false (overlord šalje da li je study session u toku)
 *   - user
 * ---------------------------------------------------------------------------------------------------------------------
 * States:
 *   - studying: truel/false - da li treba timer da se prikazuje
 * ---------------------------------------------------------------------------------------------------------------------
 */

class StatusComponent extends Component {

    constructor(props) {
        super(props);
    
        this.state = {
             studying: props.isStudying
        }
    }

    componentDidUpdate(prevProps, prevState)
    {
        if(prevProps !== this.props)
        {
            this.setState({
                studying: this.props.isStudying,
            })
        }
    }
    

    render() {
        let studyTimer;
        if(this.state.studying === true)
        {

            studyTimer = <Toast  onClose={() => this.props.theEnd()}>
                        <ToastHeader></ToastHeader>
                        <StudyTimer theEnd={this.props.theEnd} type={"work"} workTime={this.props.workTime}
                        breakTime={this.props.breakTime}></StudyTimer>
                        </Toast>
            // studyTimer = <StudyTimer theEnd={this.props.theEnd} type={"work"} workTime={5000}
            // breakTime={3000}></StudyTimer>
        }
        return (
            <div>
                <MotivationalMessagesController 
                resetMMChanged={this.props.resetMMChanged} 
                dbMMChanged={this.props.dbMMChanged}>
                    
                </MotivationalMessagesController>

                {studyTimer}

                <Invites user = {this.props.user}></Invites>
            </div>

        )
    }
}

export default StatusComponent
