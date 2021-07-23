import React, { Component } from 'react'
import {DisplayQuestion} from "./DisplayQuestion";
import {TestNav} from "./TestNav";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

export class DisplayTest extends Component {
    
    constructor(props)  {
        super(props);

        this.state = {
            currentQuestion: 0,
            numberOfQuestions: this.props.numberOfQuestions,
            mode: 'testing',
            answered: false
        };

        this.test = this.props.test;

        this.answers = [];
        
        this.shuffleAnswers(this.test);

        this.shuffleAnswers = this.shuffleAnswers.bind(this);
        this.renderTesting = this.renderTesting.bind(this);
        // this.renderReview = this.renderReview.bind(this);
    }

    testingMode = () => {
        this.setState({
            mode: 'testing'
        });
    }

    reviewMode = () => {
        this.setState({
            mode: 'review'
        });
    }

    changeQuestion = (number) => {
        this.setState ({
            currentQuestion: number
        });
    }

    changeAnswer = (answer, index) => {
        this.answers[index] = answer
        this.setState({
            answered: !this.state.answered
        })
    }

    calculatePoints = () => {
        let p = 0
        this.answers.forEach(a => {
            if(a!=undefined)
                if(a.trueFalse === true)
                    p++
        })

        return p
    }

    shuffleFunction = (array) => {
        for(let i = array.length - 1; i>0; i--) {
            const j = Math.floor(Math.random()* (i+1));
            [array[i], array[j]] = [array[j], array[i]]
        }
    }

    shuffleAnswers(test) {
        Object.entries(test).forEach(a => {
            this.shuffleFunction(a[1][1])
        })
    }

    goBack = () => {
        this.props.emptySelectedCS()
        this.props.goBack()
    }

    cancel = () => {
        confirmAlert({
            title: 'Confirm to cancel',
            message: 'You sure you want to cancel?',
            buttons: [
              {
                label: 'Yup',
                onClick: () => {
                    this.goBack();
                }
              },
              {
                label: 'Nope'
              }
            ]
        });
    }

    submit = () => {
        confirmAlert({
            title: 'Confirm to submit',
            message: 'You sure you want to submit, there is no going back?',
            buttons: [
              {
                label: 'Yup',
                onClick: () => {
                    this.reviewMode();
                }
              },
              {
                label: 'Nope'
              }
            ]
        });
    }


    renderTesting() {
        let element = (
            <React.Fragment>
                <div className="container-fluid flex-row">
                <div className="col-2">
                    <TestNav 
                        mode={this.state.mode} 
                        test={this.test} 
                        goBack={this.cancel}
                        submit={this.submit}
                        changeQuestion={this.changeQuestion}
                        numberOfQuestions={this.state.numberOfQuestions}
                        currentAnswer={this.answers[this.state.currentQuestion]}
                        calculatePoints={this.calculatePoints}/>
                </div>
                <div className="col-10" >
                    <DisplayQuestion 
                        mode={this.state.mode} 
                        test={this.test}
                        currentQuestion={this.state.currentQuestion} 
                        changeQuestion={this.changeQuestion}
                        numberOfQuestions={this.state.numberOfQuestions}
                        currentAnswer={this.answers[this.state.currentQuestion]}
                        changeAnswer={this.changeAnswer}
                        />
                </div>
                </div>
            </React.Fragment>
        );

        return element;
    }

    // renderReview() {

    // }
    
    render() {
        let element = this.renderTesting();

        return element;
    }
}

export default DisplayTest
