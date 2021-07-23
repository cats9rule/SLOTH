import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import "../../styles/global.css";
import ColorPicker from "../Cardset/ColorPicker.js"
import {Event} from "../../Models/event.js"
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Flatpickr from "react-flatpickr"
import "flatpickr/dist/themes/material_green.css"

class EventForm extends Component {
    constructor(props) {
        super(props);
        let now = new Date();
        if (this.props.action === "create") {
            this.state = {
                action: "create",
                userid: this.props.userid,
                title: "Title",
                color: "#fffefaff",
                from: new Date(now.getTime() + now.getTimezoneOffset() * 60000),
                to: new Date(now.getTime() + now.getTimezoneOffset() * 60000), 
            }
        }
        if (this.props.action === "edit") {
            this.state = {
                action: "edit",
                userid: this.props.userid,
                title: this.props.title,
                color: this.props.color,
                from: this.props.from,
                to: this.props.to
            }
        }

        this.onColorChange = this.onColorChange.bind(this);
        this.useridChangeHandler = this.useridChangeHandler.bind(this);
        this.titleChangeHandler = this.titleChangeHandler.bind(this);
    }

    colorChangeHandler = (event) => {
        this.setState({ color: event.target.value });
        if (/^#[0-9A-F]{8}$/i.test(event.target.value)) {
          this.setState({ color: event.target.value });
        }
    };

    onColorChange = (color) => {
        this.setState({
          color: color.hex8String,
        });
    };

    useridChangeHandler = (event) => {
        this.setState({userid: event.target.value})
    }

    titleChangeHandler = (event) => {
        this.setState({title: event.target.value});
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.color != this.state.color) {
          this.setState({ color: this.state.color });
        }
    }

    fetchCreateEvent() {
      console.log(this.state.userid)
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json"  },
        body: JSON.stringify({
            title: this.state.title,
            color: this.state.color,
            from: this.state.from,
            to: this.state.to
        }),
      };

      const fetchFunction = async () =>  {
        const response = await fetch("https://localhost:5001/SLOTH/CreateEvent/" + this.state.userid, requestOptions);
        if (response.ok) {
            this.props.setStateAction();
        }
      }

      fetchFunction();
    }

    fetchEditEvent () {
      console.log(this.props.id)
      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json"  },
        body: JSON.stringify({
            id: this.props.id,
            title: this.state.title,
            color: this.state.color,
            from: this.state.from,
            to: this.state.to
        }),
      };

      const fetchFunction = async () =>  {
        const response = await fetch("https://localhost:5001/SLOTH/UpdateEvent/", requestOptions);
        if (response.ok) {
            this.props.setStateAction();
        }
      }

      fetchFunction();
    }

    createEvent = (event) => {
        event.preventDefault();
        this.fetchCreateEvent();
    }

    editEvent = (event) => {
        event.preventDefault();
        this.fetchEditEvent();
    }

    deleteEvent() {

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
                fetch("https://localhost:5001/SLOTH/DeleteEvent/" + this.props.id, requestOptions)
                    .then(response => {
                    if(response.ok) {
                        this.props.setStateAction();
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

    cancel() {
        confirmAlert({
            title: 'Confirm to cancel',
            message: 'You sure you want to cancel?',
            buttons: [
              {
                label: 'Yup',
                onClick: () => {
                    this.props.setStateAction();
                }
              },
              {
                label: 'Nope'
              }
            ]
          });
    }

    toISOLocal(d) {
      var z  = n =>  ('0' + n).slice(-2);
      var zz = n => ('00' + n).slice(-3);
      var off = d.getTimezoneOffset();
      var sign = off < 0? '+' : '-';
      off = Math.abs(off);
    
      return d.getFullYear() + '-'
             + z(d.getMonth()+1) + '-' +
             z(d.getDate()) + 'T' +
             z(d.getHours()) + ':'  + 
             z(d.getMinutes()) + ':' +
             z(d.getSeconds()) + '.' +
             zz(d.getMilliseconds()) +
             sign + z(off/60|0) + ':' + z(off%60); 
    }

    renderCreate() {
        return (
            <React.Fragment>
                <h3>Create Event</h3>
                <Form className="container pt-5" onSubmit={this.createEvent}>
              <Form.Group as={Row}>
                <Form.Label column sm={2}>
                  Title:
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    required
                    aria-describedby="title-helpblock"
                    value={this.state.title}
                    onChange={this.titleChangeHandler}
                  />
                  <Form.Text id="title-helpblock" muted>
                    Title must not contain any special characters.
                  </Form.Text>
                </Col>
              </Form.Group>
    
              <Form.Group as={Row}>
                <Form.Label column sm={2}>
                  Color:
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    required
                    aria-describedby="color-helpblock"
                    value={this.state.color}
                    onChange={this.colorChangeHandler}
                    style={{ background: `${this.state.color}` }}
                  />
                  <Form.Text id="color-helpblock" muted>
                    Please choose a color for your card set.
                  </Form.Text>
                </Col>
                <div className="container-fluid flex-centered">
                  <ColorPicker
                    color={this.state.color}
                    onColorChange={this.onColorChange}
                  ></ColorPicker>
                </div>
              </Form.Group>
              <Form.Group>
                <Form.Label>Choose beginning date:</Form.Label>
                <Flatpickr
                  data-enable-time
                  value={this.state.from}
                  onChange = {(date) => {
                    console.log(date)
                    if (!date.length)
                          return;
                    //const ISODate = date[0].toISOString(); // iso date str
                    const ISODate = this.toISOLocal(date[0]);
                    this.setState({ from: ISODate, to: ISODate })
                    console.log(this.state.from)
                  }}/>
                <Form.Label>Choose ending date:</Form.Label>
                <Flatpickr
                  data-enable-time
                  value={this.state.to}
                  onChange={(date) => { 
                    console.log(date)
                    if (!date.length)
                          return;
                    //const ISODate = date[0].toISOString(); // iso date str
                    const ISODate = this.toISOLocal(date[0]);
                    this.setState({ to: ISODate })
                    console.log(this.state.to)
                   }} />
              </Form.Group>
                    <Row>
                        <Button variant="success" type="submit">
                            Create
                        </Button>
                        <Button variant="danger" onClick={() => this.cancel()}>
                            Cancel
                        </Button>
                    </Row>
                
                </Form>
            </React.Fragment>
        )
    }

    renderEdit() {
        return (
            <React.Fragment>
                <h3>Edit Event</h3>
                <Form className="container pt-5" onSubmit={this.editEvent}>
                <Form.Group as={Row}>
                <Form.Label column sm={2}>
                  Title:
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    required
                    aria-describedby="title-helpblock"
                    value={this.state.title}
                    onChange={this.titleChangeHandler}
                  />
                  <Form.Text id="title-helpblock" muted>
                    Title must not contain any special characters.
                  </Form.Text>
                </Col>
              </Form.Group>
    
              <Form.Group as={Row}>
                <Form.Label column sm={2}>
                  Color:
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    required
                    aria-describedby="color-helpblock"
                    value={this.state.color}
                    onChange={this.colorChangeHandler}
                    style={{ background: `${this.state.color}` }}
                  />
                  <Form.Text id="color-helpblock" muted>
                    Please choose a color for your card set.
                  </Form.Text>
                </Col>
                <div className="container-fluid flex-centered">
                  <ColorPicker
                    color={this.state.color}
                    onColorChange={this.onColorChange}
                  ></ColorPicker>
                </div>
              </Form.Group>
              
              <Form.Group>
              <Flatpickr
                  data-enable-time
                  value={this.state.from}
                  onChange = {(date) => {
                    console.log(date)
                    if (!date.length)
                          return;
                    //const ISODate = date[0].toISOString(); // iso date str
                    const ISODate = this.toISOLocal(date[0]);
                    this.setState({ from: ISODate, to: ISODate })
                    console.log(this.state.from)
                  }}/>
                <Form.Label>Choose ending date:</Form.Label>
                <Flatpickr
                  data-enable-time
                  value={this.state.to}
                  onChange={(date) => { 
                    console.log(date)
                    if (!date.length)
                          return;
                    //const ISODate = date[0].toISOString(); // iso date str
                    const ISODate = this.toISOLocal(date[0]);
                    this.setState({ to: ISODate })
                    console.log(this.state.to)
                   }} />
              </Form.Group>
                
                    <Row>
                        <Button variant="success" type="submit">
                            Update
                        </Button>
                        <Button variant="danger" onClick={() => this.cancel()}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={() => this.deleteEvent()}>
                            Delete This Event
                        </Button>
                    </Row>
                </Form>
            </React.Fragment>
        )
    }

    render() {
        let element = null;
        if (this.state.action === "create") {
            element = this.renderCreate();
        }
        else if (this.state.action === "edit") {
            element = this.renderEdit();
        }
        else {
            element = 
            <div>
                EventForm Error: this.props.action is not valid.
                <br />
                this.props.action: {this.props.action}
            </div>
        }

        return element;
    }
}

export default EventForm;
