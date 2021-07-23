import React, { Component } from 'react';

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";

export class DisplayQuestion extends Component {
    
    constructor(props)  {
        super(props)

        this.state = {
            rerender: false,
        }

        this.currentAnswer=this.props.currentAnswer

        this.currentQuestion = this.props.currentQuestion;
        this.answer = null;
    }

    saveAnswer = (ans, qn) => {
        this.props.changeAnswer(ans, qn);
        this.currentAnswer=ans;
        this.setState({
            rerender: !this.state.rerender
        })
    }

    testMode = () =>    {

        let qn = this.props.test[this.props.currentQuestion][0];

        let answers = <div className="mt-5 ml-5"></div>

        answers = this.props.test[this.props.currentQuestion][1].map(A => (
            <Col key={A.answer}>
                <Form.Check
                    type="radio"
                    id={A} 
                    label={A.answer}
                    name="answerRadio"
                    checked={this.props.currentAnswer===A}
                    onChange={() => this.saveAnswer(A, this.props.currentQuestion)}/>
            </Col>

        ))

        let element = (
            <div className="m-5">
                <h5>Q{this.props.currentQuestion + 1}: {qn}</h5>
                <div className="answers">
                    <Form.Group>
                        {answers}
                    </Form.Group>
                </div>
                <div>
                <button className="btn btn-outline-dark" 
                    onClick={() => this.props.changeQuestion(this.props.currentQuestion-1)}
                    disabled={this.props.currentQuestion == 0}
                    >Previous question</button>
                <button className="btn btn-outline-dark"  
                    onClick={() => this.props.changeQuestion(this.props.currentQuestion+1)}
                    disabled={this.props.currentQuestion == this.props.numberOfQuestions-1}
                    >Next question</button>
                </div>
            </div>
        );

        return element;
    }

    reviewMode = () =>  {
        let qn = this.props.test[this.props.currentQuestion][0];
        let correct;
        this.props.test[this.props.currentQuestion][1].forEach(an => {
            if(an.trueFalse === true)
                correct = an;
        })

        let element
        if(this.props.currentAnswer!==undefined) {
            if(this.props.currentAnswer.trueFalse===true)   {
                element = (
                    <div className="m-5">
                        <h5>Q{this.props.currentQuestion + 1}: {qn}</h5>
                        <div className="answers">
                        <h6>Correct!</h6>
                        <p className="text-left"><b>Answer: </b>{correct.answer}</p>
                        <br />
                        </div>
                        <div>
                        <button className="btn btn-outline-dark" 
                            onClick={() => this.props.changeQuestion(this.props.currentQuestion-1)}
                            disabled={this.props.currentQuestion == 0}
                            >Previous question</button>
                        <button className="btn btn-outline-dark" 
                            onClick={() => this.props.changeQuestion(this.props.currentQuestion+1)}
                            disabled={this.props.currentQuestion == this.props.numberOfQuestions-1}
                            >Next question</button>
                        </div>
                    </div>
                )
            }
            else    {
                element = (
                    <div className="m-5">
                        <h5>Q{this.props.currentQuestion + 1}: {qn}</h5>
                        <div className="answers">
                        <h6>False</h6>
                        <p className="text-left"><b>Correct answer:</b> {correct.answer}</p>
                        <p className="text-left"><b>Your answer:</b> {this.props.currentAnswer.answer}</p>
                        <br />
                        </div>
                        <div>
                        <button className="btn btn-outline-dark" 
                            onClick={() => this.props.changeQuestion(this.props.currentQuestion-1)}
                            disabled={this.props.currentQuestion == 0}
                            >Previous question</button>
                        <button className="btn btn-outline-dark" 
                            onClick={() => this.props.changeQuestion(this.props.currentQuestion+1)}
                            disabled={this.props.currentQuestion == this.props.numberOfQuestions-1}
                            >Next question</button>
                        </div>
                    </div>
                )
            }
        }
        else    {
            element = (
                <div className="m-5">
                    <h5>Q{this.props.currentQuestion + 1}: {qn}</h5>
                    <div className="answers">
                    <h6>Aw, you didnt even try :c</h6>
                    <p className="text-left"><b>Correct answer:</b> {correct.answer}</p>
                    <br />
                    </div>
                    <div>
                    <button className="btn btn-outline-dark" 
                        onClick={() => this.props.changeQuestion(this.props.currentQuestion-1)}
                        disabled={this.props.currentQuestion == 0}
                        >Previous question</button>
                    <button className="btn btn-outline-dark" 
                        onClick={() => this.props.changeQuestion(this.props.currentQuestion+1)}
                        disabled={this.props.currentQuestion == this.props.numberOfQuestions-1}
                        >Next question</button>
                    </div>
                </div>
            )
        }

        return element;
    }

    render() {
        let element;
        switch (this.props.mode) {
            case "testing":
                element = this.testMode();
                break;
            case "review":
                element = this.reviewMode();
                break;
            default:
                break;
        }
        return element;
    }
}

export default DisplayQuestion
