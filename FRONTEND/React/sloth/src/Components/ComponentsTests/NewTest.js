import React, { Component } from "react";
import DisplayCardSets from "./DisplayCardSets";
import Form from "react-bootstrap/Form";
import DisplayTest from "./DisplayTest"
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

class NewTest extends Component {
  constructor(props) {
    super(props);

    this.cardsets = this.props.cardsets;
    this.test = null;

    this.state = {
      numberOfQuestions: "0",
      testIsGenerated: false,
      view: "creating",
      statusCode: 200
    };

    this.generateTest = this.generateTest.bind(this);
    this.createTest = this.createTest.bind(this);
    this.startTest = this.startTest.bind(this);
    this.beginTest = this.beginTest.bind(this);
    this.testCreation = this.testCreation.bind(this);
  }

  NoQHandler = (event) => {
    this.setState({
      numberOfQuestions: event.target.value,
    });
  };

  generateTest() {
    let selectedCardSets = this.props.selectedCardSets;

    fetch(
      "https://localhost:5001/SLOTH/TestGenerator/" +
        this.state.numberOfQuestions,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ids: selectedCardSets,
        }),
      }
    ).then((p) => {
      if (p.ok) {
        p.json().then((data) => {
          this.test = Object.entries(data);
          
            /*
            so basically posto je sve mapirano i ima redosled moze sa Object.keys.forEach(k => bla bla) da se kreiraju pitanja
            onda sa Object.values.forEach(v => bla bla) da se kreiraju odgovori za svako od pitanja za svaki answer ima string i bool (trueFalse) i uvek je prvi odg true ostali false
            ostaje kako to da se pamti ovde, its on yall i trebalo bi da se randomizuju odgovori (uvek ih ima 4 tako da moze neki random od 0 do 4
            */
          if (this.state.numberOfQuestions != 0)
            this.setState({
              testIsGenerated: true,
            });
        });
      }
      else if(p.status === 405) {
        confirmAlert({
          title: 'Error',
          message: 'Selected cardsets don\'t meet the requirements for creating a test.',
          buttons: [
            {
              label: 'Ok',
              onClick: () => {
                  this.emptySelectedCS();
              }
            }
          ]
        });
      }
      else if(p.status === 406) {
        confirmAlert({
          title: 'Error',
          message: 'Cannot generate a test with ' + this.state.numberOfQuestions + ' questions based on selected cardsets.',
          buttons: [
            {
              label: 'Ok',
              onClick: () => {
                  this.emptySelectedCS();
              }
            }
          ]
        });
      }
    });
  }

  setStatusCode = (code) => {
    this.setState({
      statusCode: code
    })
  }

  createTest() {
    this.setState({
      view: "creating",
      numberOfQuestion: 0
    });
  }

  startTest() {
    this.setState({
      view: "testing"
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
              this.props.goBack();
          }
        },
        {
          label: 'Nope'
        }
      ]
  });
  }

  emptySelectedCS = () => {
    this.setState({
      numberOfQuestions: "0",
      testIsGenerated: false,
      statusCode: 200,
      view: "creating"
    }, this.props.emptySelectedCS())
  }

  beginTest() {
    let element = (
      <div>
        <DisplayTest test={this.test} 
        numberOfQuestions={this.state.numberOfQuestions} 
        goBack={this.createTest}
        emptySelectedCS={this.emptySelectedCS}/>
      </div>
    )

    return element;
  }

  testCreation() {
    let but;
    if(this.state.testIsGenerated)  {
      but = (
        <button className="btn btn-success" onClick={this.startTest}>
              Start
            </button>
        )
    }
    else {
      but = (
        <button className="btn btn-primary" onClick={this.generateTest}>
            Generate test
          </button>
      )
    }

    let element = (
      <React.Fragment>
        <h2>New Test</h2>
        <Form.Group as = {Row} className="justify-content-center">
          <Form.Label sm={6}>Number of Questions:</Form.Label>
          <Col sm={6}>
            <Form.Control
              type="number"
              placeholder={this.state.numberOfQuestions}
              value={this.state.numberOfQuestions}
              min="0"
              onChange={this.NoQHandler}
            ></Form.Control>
            </Col>
        </Form.Group>

        <DisplayCardSets
          addCardSetID={this.props.addCardSetID}
          removeCardSetID={this.props.removeCardSetID}
          cardsets={this.cardsets}
        ></DisplayCardSets>
        <div>
          {but}
          <button className="btn btn-danger" onClick={() => this.cancel()}>
            Cancel
          </button>
        </div>
      </React.Fragment>
    );

    return element;
  }

  render() {

    let element;
    switch (this.state.view)  {
      case "creating": 
        element = this.testCreation();
        break;
      case "testing":
        element = this.beginTest();
        break;
      default:
    }

    return element;
  }
}

export default NewTest;
