import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import EventForm from "./EventForm.js";
import { Calendar } from "../../Models/calendar.js";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

class AdminCalendarsPanel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            view: "default",
            action: "browse",
            events: [],
            filteredEvents: [],
            fetching: true,
            count:""
        };

        this.setStateAction = this.setStateAction.bind(this);
    }

    setStateAction(clicked) {
        switch(clicked)
        {
            case "create":
                this.setState({action: "create"});
                break;
            case "edit":
                this.setState({action: "edit"});
                break;
                case "view":
                this.setState({action: "view"});
                break;
            default:
                this.setState({action: "browseAfter"});
                this.fetchEvents();
                break;
        }
    }

    fetchEvents() {
        this.setState({fetching: true});
        let es = [];
        fetch("https://localhost:5001/SLOTH/GetAllEvents/")
            .then(response => response.json())
            .then(data => {
                data.forEach(ev => {
                    console.log(ev)
                    let event = new Event(ev.id, ev.title, ev.color, ev.from, ev.to);
                    es.push(event);
                    console.log(es)
                });
            this.setState({events:es, fetching: false, filteredEvents: es, count: es.length});
            console.log(this.state.events)
        })
        .catch(e => {
            this.setState({...this.state, fetching: false});
        })
    }

    componentDidMount() {
        this.fetchEvents();
    }

    openFormForCreate() {
        return <EventForm setStateAction={this.setStateAction}
                          action="create">
               </EventForm>
    }

    openFormForEdit() {
        let e = this.state.events[this.state.index]
        return <EventForm setStateAction={this.setStateAction}
                          action="edit"
                          title={e.title}
                          color={e.color}
                          from={e.from}
                          to={e.to}
                          id={e.id}>
        </EventForm>
    }

    openEvents() {

    }

    viewSelected(index) {
        this.setStateAction("view");
        this.setState({index: index});
    }

    editSelected(index) {
        this.setStateAction("edit");
        this.setState({index: index});
    }

    deleteSelected(index) {
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
                    fetch("https://localhost:5001/SLOTH/DeleteEvent/" + this.state.events[index].id, requestOptions)
                        .then(response => {
                        if(response.ok) {
                            this.props.setStateAction();
                        }  
                        else
                            alert("response was not ok");
                        })
                    }
              },
              {
                label: 'Nope'
              }
            ]
          });
    }
    
    renderTableHeader() {
        let header = Object.keys(this.state.events[0]);
        return header.map((key, index) => {
            if (key.toUpperCase() === "ID") 
                return <th key = {index} style={{backgroundColor:"#a0a6b0"}}>{key.toUpperCase()}</th>
            else
                return <th key = {index}>{key.toUpperCase()}</th>
        })
    }

    renderTableData() {
        return this.state.filteredEvents.map((event, index) => {
            const {id, title, color, from, to} = event;
            return (
                <tr key = {id}>
                    <td style={{backgroundColor:"#a0a6b0"}}>{id}</td>
                    <td>{title}</td>
                    <td style={{backgroundColor:color}}>{color}</td>
                    <td>{from}</td>
                    <td>{to}</td>
                    <td><Button variant="primary" onClick={() => this.editSelected(index)}>Edit</Button></td>
                    <td><Button variant="danger" onClick={() => this.deleteSelected(index)}>Delete</Button></td>
                </tr>
            )
        })
    }

    renderBrowse() {
        let element;
        if (this.state.fetching) {
            element = <h3>We are getting events ready wait a bit</h3>;
        }
        else
        {
            if(this.state.events.length === 0)
            {
                element = 
                <div>
                    <div>
                        <h3>Events not found in the database. Why not create one?</h3> 
                        <Button variant="primary" onClick={() => this.setStateAction("create")}>Create Event</Button>
                    </div>
                    <div>
                        <h3>To go back to Main Admin Panel select Go Back option</h3>
                        <Button variant="primary" onClick={this.props.setStateView}>Go back</Button>
                    </div>
                </div>
            }
            else
            {
                element = 
                <div>
                    <h3>All Events in database</h3>
                    <h5>Currently count of Events in database is: {this.state.count}</h5>
                    <Table striped bordered hover size="sm" responsive="md" id = "mmessages">
                        <tbody>
                            <tr>
                               {this.renderTableHeader()}
                               <th key = "options" colSpan="2">Options</th>
                            </tr>
                            {this.renderTableData()}
                        </tbody>
                    </Table>
                    <div align="left">
                        <h4>To create new Event select Create option</h4>
                        <Button variant="primary" onClick={() => this.setStateAction("create")}>Create Event</Button>
                    </div>
                    <div align="left">
                        <h4>To go back to Main Admin Panel select Go Back option</h4>
                        <Button variant="primary" onClick={this.props.setStateView}>Go back</Button>
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
        case "browseAfter":
            element = this.renderBrowse();
            break;
        default:
            element = <div>Error: this.state.view is not valid.</div>;
            break;
        }
    
        return element;
    }
}

export default AdminCalendarsPanel;