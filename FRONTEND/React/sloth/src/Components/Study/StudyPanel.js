import React, { Component } from "react";
import MakePlanForm from "./MakePlanForm.js";
import Button from "react-bootstrap/Button";
import { StudyPlan } from "../../Models/studyPlan.js";
import StudyPlans from "./StudyPlans.js";
import StudyTimer from "./StudyTimer.js";


/**
 * KOMPONENTA STUDYPANEL
 * 
 * Props:
 *  user
 * 
 *  State:
 *  view - panel/create
 *  fetching - 
 *  studyplans -
 */
class StudyPanel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            view: "panel",
            fetching: true,
            studying: false,
            studyplans: [],

        };

        this.createStudyPlan = this.createStudyPlan.bind(this);
        this.enterPanel = this.enterPanel.bind(this);
        this.deleteStudyPlan = this.deleteStudyPlan.bind(this);
        //this.startStudyPlan = this.startStudyPlan.bind(this);
        this.addStudyPlan = this.addStudyPlan.bind(this);
    }

    enterPanel(){
        this.setState({
            view: "panel"
        })
    }

    // startStudyPlan(workTime, breakTime)
    // {
    //     this.setState({
    //         studying: true,
    //         workTime: workTime,
    //         breakTime: breakTime
    //     });
    // }
    createStudyPlan(){
        this.setState({
            view:"create",
            studyplans: [],

        })
    }

    deleteStudyPlan(id)
    {
        let studyplans = this.state.studyplans;
        for(var i = 0; i < studyplans.length; i++)
        {
            if(studyplans[i].id === id)
            {
                studyplans.splice(i,1);
            }
        }
        this.setState({
            studyplans: studyplans,

        })
    }

    addStudyPlan(sp)
    {
        let studyplans = this.state.studyplans;
        if(!studyplans.includes(sp))
            studyplans.push(sp);
        this.setState({
            studyplans: studyplans,
    
        })
        

    }
    openPanel(){
        if(this.state.fetching){
            return <h1>Fetching data...</h1>
        }

        let element = (
            <div>
            <Button variant="outline-dark" onClick={this.createStudyPlan}>
                Create New Study Plan</Button>
            </div>
        );

        if(this.state.studyplans.length > 0)
        {
           return( <React.Fragment>
                {element}
                <StudyPlans startStudyPlan={this.props.startStudyPlan} deleteStudyPlan={this.deleteStudyPlan} studyplans = {this.state.studyplans}></StudyPlans>
            </React.Fragment>
           );
        }
        else
        {
            return(<React.Fragment>
                <h2>There are no study plans available. You can maybe make your own?</h2>
                {element}
            </React.Fragment>);
        }

       
    }
    openCreateForm(){
        return <MakePlanForm addStudyPlan = {this.addStudyPlan} startStudyPlan={this.props.startStudyPlan} user = {this.props.user} goBack = {this.enterPanel}></MakePlanForm>
    }

    fetchStudyPlans(){
        this.setState({
            fetching:true,

        });

        let studyplans = [];

        fetch("https://localhost:5001/SLOTH/GetStudyPlan/" + this.props.user.id)
                .then(response => response.json())
                .then(data => {
                    data.forEach(sp => {
                        let newStudyPlan = new StudyPlan(sp.id, sp.name, sp.workTime, sp.breakTime);

                        if(!studyplans.includes(newStudyPlan))
                            studyplans.push(newStudyPlan);
                    });
                    this.setState({studyplans: studyplans, fetching:false});
                })
                .catch(e => {
                    console.log(e);
                    this.setState({...this.state, fetching:false});
                })
    }

    componentDidMount()
    {
        switch(this.state.view)
        {
            case "panel":
                this.fetchStudyPlans();
                break;
            case "create":
                break;
            default:
        }
    }
    componentDidUpdate(prevProps, prevState)
    {
        
        
        if(prevState.view === "create")
            switch(this.state.view)
            {
                case "panel":
                    this.fetchStudyPlans();
                    break;
                case "create":
                    break;
                default:
            }
    }
    render() {

        let element;
        let studyTimer=null;
        if(this.state.studying === true)
        {
            studyTimer = <StudyTimer type={"work"} workTime={this.state.workTime}
                        breakTime={this.state.breakTime}></StudyTimer>
        }
        switch(this.state.view)
        {
            case "panel":
                element = this.openPanel();
                break;
            case "create":
                element = this.openCreateForm();
                break;
            default:
                element = <div>Nothing to render.</div>
                break;
        }
        return <div>
            {element}
            {studyTimer}
        </div>
    }
}

export default StudyPanel;