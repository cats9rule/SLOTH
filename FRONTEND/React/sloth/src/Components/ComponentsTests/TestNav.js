import React, { Component } from 'react'
import NavButton from './NavButton';

export class TestNav extends Component {

    constructor(props)  {
        super(props);

        this.state = {
            test: this.props.test
        }
    }

    submit = () => {    
        this.props.changeQuestion(0)
        this.props.submit()
    }

    testNav = () => {
        let i = 0;
        let niz = [];

        this.state.test.forEach(x => {
            niz.push(i);
            i++;
        })

        const items = niz.map((question) => (
            <NavButton key={question} index={question} changeQuestion={this.props.changeQuestion}></NavButton>
        ));




        let element = (
            <React.Fragment>
                <h2>Questions:</h2>
                <div className="answers">
                    <p>{items}</p>
                    <button className="btn btn-success" onClick={this.submit}>Submit</button>
                    <button className="btn btn-danger" onClick={this.props.goBack}>Cancel</button>
                </div>
            </React.Fragment>
        );

        return element;
    }

    reviewNav = () => {
        let i = 0;
        let niz = [];
        let points = this.props.calculatePoints();

        this.state.test.forEach(x => {
            niz.push(i);
            i++;
        })

        const items = niz.map((question) => (
            <NavButton key = {question} index={question} changeQuestion={this.props.changeQuestion}></NavButton>
        ));




        let element = (
            <React.Fragment>
                <h2>Questions:</h2>
                <p>{items}</p>
                <br />
                <p>Points: {points}/{this.props.numberOfQuestions}</p>
                <br />
                <button className="btn btn-danger" onClick={this.props.goBack}>Finish Review</button>
            </React.Fragment>
        );

        return element;
    }

    render() {
        let element;
        // console.log(this.props.numberOfQuestions)
        switch (this.props.mode) {
            case "testing":
                element = this.testNav();
                break;
            case "review":
                element = this.reviewNav();
                break;
            default:
                element = <p>whoopsie.</p>
                break;
        }

        return element;
    }
}

export default TestNav
