import React, {Component} from "react";
import Timer from "../ComponentsTime/Timer.js"
import "../../styles/studyplan.css";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

/**
 * KOMPONENTA STUDYPLANS:
 * 
 * Prikaz svi study planova koje je korisnik kreirao
 * 
 *  props:
 *  studyplans - niz study planova
 *  
 */

class StudyPlans extends Component{
    constructor(props)
    {
        super(props);
        this.state = {
        }


    }

    deleteStudyPlan(event, id)
    {
        event.preventDefault();
        const requestOptions = {
            method: 'Delete',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify()

        };

        confirmAlert({
            title: 'Confirm to delete',
            message: 'You sure you want to delete?',
            buttons: [
              {
                label: 'Yup',
                onClick: async () => {
                    fetch("https://localhost:5001/SLOTH/DeleteStudyPlan/" + id, requestOptions)
                        .then(response => {
                            if(response.ok){
                                this.props.deleteStudyPlan(id);
                        }
                        else
                        {

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

    render() {
        const items = this.props.studyplans.map((studyplan) => (
            <div key = {studyplan.id} className="studyplan">
                <h4>{studyplan.name}</h4>
                <div className="times">
                    <div className="workTime time">
                        Work time
                        <div className="timer"><Timer timerTime = {studyplan.workTime * 60000}></Timer></div>
                    </div>
                    <div className="breakTime time">
                        Break time
                        <div className="timer"><Timer timerTime = {studyplan.breakTime * 60000}></Timer></div>
                    </div>
                </div>
                <div>
                    <button 
                    className="btn btn-dark"
                    onClick={() => this.props.startStudyPlan(studyplan.workTime * 60000, studyplan.breakTime * 60000)}
                    >
                        Start
                    </button>

                    <button 
                    className="btn btn-dark"
                    onClick={(e) => this.deleteStudyPlan(e, studyplan.id)}
                    >
                        Delete
                    </button>
                </div>
            </div>
        ));

        return <div className="container-fluid studyplans">{items}</div>;
    };
}
export default StudyPlans;