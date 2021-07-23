import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import EventForm from "./EventForm.js";
import Calendar from 'react-awesome-calendar';
import {Event} from "../../Models/event.js"

class CalendarPanel extends Component {
    constructor(props) {
        super(props);
        this.calendar = React.createRef();
        this.state = {
            action: "browse",
            events: [],
            fetching: false
        };

        this.setStateAction = this.setStateAction.bind(this);
        this.createNewEvent = this.createNewEvent.bind(this);
        this.newEvent = this.newEvent.bind(this);
    }

    setStateAction(action) {
        switch(action)
        {
            case "edit":
                this.setState({action: "edit"});
                break;
            case "create":
                this.setState({action: "create"});
                break;
            default:
                this.setState({action: "browse"});
                this.fetchEvents();
                break;
        }
    }

    fetchEvents() {
        this.setState({fetching:true});
        let es = [];
        fetch("https://localhost:5001/SLOTH/GetEvents/" + this.props.user.id)
            .then(response => response.json())
            .then(data => {
                data.forEach(ev => {
                    let event = new Event(ev.id, ev.title, ev.color, ev.from, ev.to);
                    es.push(event);
                });
                this.setState({events:es, fetching: false});
            })
            .catch(e => {
                this.setState({...this.state, fetching: false});
            })
    }


    openFormForEdit() {
        let e = this.state.events.find(el => el.id === this.state.id)
        console.log(e);
        return <EventForm setStateAction={this.setStateAction}
                          action="edit"
                          title={e.title}
                          color={e.color}
                          from={e.from}
                          to={e.to}
                          userid={this.props.user.id}
                          id={e.id}>
        </EventForm>
    }
    
    newEvent() {
        this.setStateAction("create")
    }

    createNewEvent() {
        let element = (
            <React.Fragment>
                <EventForm setStateAction={this.setStateAction}
                            action="create"
                            userid={this.props.user.id}>
                </EventForm>
            </React.Fragment>
        )

        return element;
    }

    editEvent(e) {
        this.setState({action: "edit", id: e});
    }

    componentDidMount() {
        const details = this.calendar.current.getDetails();
        console.log(details);
        this.fetchEvents();
    }

    render() {
        let element
        if (this.state.fetching) {
            element = <h3>We are getting events ready wait a bit</h3>;
        }
        if (this.state.action === "browse")
            element = 
                <div>
                    <Calendar
                        ref={this.calendar}
                        onClickEvent={(event) => this.editEvent(event)}
                        events={this.state.events}/>
                        <Button variant="outline-dark" onClick={this.newEvent}>Create New Event</Button>
                </div>
        else if(this.state.action === "create")
                element = this.createNewEvent();
        else element = this.openFormForEdit();
        return element
    }
}

export default CalendarPanel;