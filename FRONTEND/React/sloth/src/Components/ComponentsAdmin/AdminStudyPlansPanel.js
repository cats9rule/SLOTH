import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import StudyPlanForm from "./StudyPlanForm.js";
import SearchBox from "../Cardset/SearchBox.js";
import { StudyPlan } from "../../Models/studyPlan.js";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

class AdminStudyPlansPanel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            view: "default",
            action: "browse",
            studyplans: [],
            filteredStudyplans: [],
            fetching: true,
            count: ""
        };

        this.setStateAction = this.setStateAction.bind(this);
        this.setFilteredPlans = this.setFilteredPlans.bind(this);
    }

    //#region StateSetting
    setStateAction(clicked) {
        switch(clicked)
        {
            case "create":
                this.setState({action: "create"});
                break;
            case "edit":
                this.setState({action: "edit"});
                break;
            default:
                this.setState({action: "browseAfter"});
                this.fetchStudyPlans();
                break;
        }
    }

    setFilteredPlans(plans) {
        this.setState({filteredStudyplans: plans})
    }
    //#endregion

    //#region FetchFunctions
    fetchStudyPlans() {
        this.setState({fetching: true});
        let studyplans = [];
        fetch("https://localhost:5001/SLOTH/GetAllStudyPlans/")
            .then(response => response.json())
            .then(data => {
                data.forEach(sp => {
                    let newStudyPlan = new StudyPlan(sp.id, sp.name, sp.workTime, sp.breakTime);
                    studyplans.push(newStudyPlan);
                });
                this.setState({studyplans: studyplans, fetching: false, filteredStudyplans: studyplans, count: studyplans.length});
            })
            .catch(e => {
                this.setState({...this.state, fetching:false});
            })
    }
    //#endregion

    componentDidMount() {
        this.fetchStudyPlans();
    }

    //#region Functions
    openFormForCreate() {
        return <StudyPlanForm setStateAction = {this.setStateAction}
                                    action="create">
               </StudyPlanForm>
    }

    openFormForEdit() {
        return <StudyPlanForm setStateAction = {this.setStateAction}
                                    action="edit"
                                    studyplan = {this.state.studyplans[this.state.index]}>
               </StudyPlanForm>
    }

    editSelected(index) {
        this.setStateAction("edit");
        this.setState({index: index});
    }

    deleteSelected(index) {
        this.setState({index: index});
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
                    fetch("https://localhost:5001/SLOTH/DeleteStudyPlan/" + this.state.studyplans[index].id, requestOptions)
                        .then(response => {
                            if(response.ok) {
                                this.fetchStudyPlans();
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
    //#endregion

    //#region RenderFunctions
    renderTableHeader() {
        let header = Object.keys(this.state.studyplans[0]);
        return header.map((key, index) => {
            if (key.toUpperCase() === "ID") 
                return <th key = {index} style={{backgroundColor:"#a0a6b0"}}>{key.toUpperCase()}</th>
            else
                return <th key = {index}>{key.toUpperCase()}</th>
        })
    }

    renderTableData() {
        return this.state.filteredStudyplans.map((plan, index) => {
            const {id, name, workTime, breakTime} = plan;
            return (
                <tr key = {id}>
                    <td style={{backgroundColor:"#a0a6b0"}}>{id}</td>
                    <td>{name}</td>
                    <td>{workTime} minutes</td>
                    <td>{breakTime} minutes</td>
                    <td><Button variant="primary" onClick={() => this.editSelected(index)}>Edit</Button></td>
                    <td><Button variant="danger" onClick={() => this.deleteSelected(index)}>Delete</Button></td>
                </tr>
            )
        })
    }

    renderBrowse() {
        let element;
        if (this.state.fetching) {
            element = <h3>We are getting plans ready wait a bit</h3>;
        }
        else
        {
            if(this.state.studyplans.length === 0)
            {
                element = 
                <div>
                    <div>
                        <h3>Study Plans not found in the database. Why not create one?</h3> 
                        <Button variant="primary" onClick={() => this.setStateAction("create")}>Create Study Plan</Button>
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
                    <h3>All Study Plans in database</h3>
                    <h5>Currently count of Study Plans in database is: {this.state.count}</h5>
                    <h5>To Filter Data use SearchBox</h5>
                    <SearchBox array={this.state.studyplans} type="plans" sendResults={this.setFilteredPlans}></SearchBox>
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
                        <h4>To create new Study Plan select Create option</h4>
                        <Button variant="primary" onClick={() => this.setStateAction("create")}>Create Study Plan</Button>
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
    //#endregion
}

export default AdminStudyPlansPanel;