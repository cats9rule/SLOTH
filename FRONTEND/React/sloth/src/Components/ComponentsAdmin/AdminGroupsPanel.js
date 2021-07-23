import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { Group } from "../../Models/group";
import AdminGroupMembersPanel from "./AdminGroupMembersPanel";
import GroupForm from "./GroupForm";
import AdminCardsetsPanel from "./AdminCardsetsPanel";
import AdminNotebooksPanel from "./AdminNotebooksPanel";
import SearchBox from "../Cardset/SearchBox.js";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

class AdminGroupsPanel extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            view: "default",
            action: "browse",
            groups: [],
            filteredGroups: [],
            fetching: true,
            count: "",
        };

        this.setStateAction = this.setStateAction.bind(this);
        this.setFilteredGroups = this.setFilteredGroups.bind(this);
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
            case "viewCardSets":
                this.setState({action: "viewCardSets"});
                break;
            case "viewNotebooks":
                this.setState({action: "viewNotebooks"});
                break;
            case "viewMembers":
                this.setState({action: "viewMembers"});
                break;
            default:
                this.setState({action: "browseAfter"});
                this.fetchGroups();
                break;
        }
    }

    setFilteredGroups(groups) {
        this.setState({ filteredGroups: groups});
    }
    //#endregion

    //#region FetchFunction
    fetchGroups() {
        this.setState({fetching:true});
        let gs = [];

        fetch("https://localhost:5001/SLOTH/GetAllGroups")
            .then(response => response.json())
            .then(data => {
                data.forEach(g => {
                    let gr = new Group(g.id, g.teacherID, g.name);
                    gs.push(gr);
                });
                this.setState({groups: gs, fetching: false, filteredGroups: gs, count: gs.length});
            })
            .catch(e => {
                this.setState({...this.state, fetching:false});
            })
    }
    //#endregion

    componentDidMount() {
        this.fetchGroups();
    }

    //#region Functions
    openFormForCreate() {
        return <GroupForm setStateAction = {this.setStateAction}
                          action="create">
               </GroupForm>
    }

    openFormForEdit() {
        return <GroupForm setStateAction = {this.setStateAction}
                          action="edit"
                          group={this.state.groups[this.state.index]}>
               </GroupForm>
    }

    openMembers() {
        return <AdminGroupMembersPanel setStateAction = {this.setStateAction}
                                       group = {this.state.groups[this.state.index]}>
               </AdminGroupMembersPanel>
    }

    openCardSets() {
        return <AdminCardsetsPanel setStateAction = {this.setStateAction}
                                   groupid = {this.state.groups[this.state.index].id}
                                   action="forGroup">   
                </AdminCardsetsPanel>
    }

    openNotebooks() {
        return <AdminNotebooksPanel setStateAction = {this.setStateAction}
                                    groupid = {this.state.groups[this.state.index].id}
                                    action="forGroup">   
                </AdminNotebooksPanel>
    }

    viewSelectedMembers(index) {
        this.setStateAction("viewMembers");
        this.setState({index: index});
    }    

    viewSelectedCardSets(index) {
        this.setStateAction("viewCardSets");
        this.setState({index: index});
    }

    viewSelectedNotebooks(index) {
        this.setStateAction("viewNotebooks");
        this.setState({index: index});
    }

    editSelected(index) {
        this.setStateAction("edit");
        this.setState({index: index});
    }

    deleteSelected(index) {
        this.setState({index: index})
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
                    fetch("https://localhost:5001/SLOTH/DeleteGroup/" + this.state.groups[index].id, requestOptions)
                        .then(response => {
                            if(response.ok) {
                                this.fetchGroups();
                            }  
                    })
                }
              },
              {
                label: 'Nope'
              }
            ]
        });
    };
    //#endregion

    //#region RenderFunctions
    renderTableHeader() {
        let forHeader = Object.keys(this.state.groups[0]).filter(key => key !== "users");
        let header = forHeader;
        return header.map((key, index) => {
            if (key.toUpperCase() === "ID") 
                return <th key = {index} style={{backgroundColor:"#a0a6b0"}}>{key.toUpperCase()}</th>
            else
                return <th key = {index}>{key.toUpperCase()}</th>
        })
    }

    renderTableData() {
        return this.state.filteredGroups.map((group, index) => {
            const {id, teacherID, name} = group;
            return (
                <tr>
                    <td style={{backgroundColor:"#a0a6b0"}}>{id}</td>
                    <td>{teacherID}</td>
                    <td>{name}</td>
                    <td><Button variant="primary" onClick={() => this.viewSelectedMembers(index)}>Members</Button></td>
                    <td><Button variant="primary" onClick={() => this.viewSelectedCardSets(index)}>Cardsets</Button></td>
                    <td><Button variant="primary" onClick={() => this.viewSelectedNotebooks(index)}>Notebooks</Button></td>
                    <td><Button variant="primary" onClick={() => this.editSelected(index)}>Edit</Button></td>
                    <td><Button variant="danger" onClick={() => this.deleteSelected(index)}>Delete</Button></td>
                </tr>
            )
        })
    }

    renderBrowse() {
        let element;
        if (this.state.fetching) {
            element = <h3>We are getting groups ready wait a bit</h3>;
        }
        else
        {
            if(this.state.groups.length === 0)
            {
                element = 
                <div>
                    <div>
                        <h3>Groups not found in the database. Why not create one?</h3> 
                        <Button variant="primary" onClick={() => this.setStateAction("create")}>Create Group</Button>
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
                    <h3>All Groups in database</h3>
                    <h5>Currently count of Groups in database is: {this.state.count}</h5>
                    <h5>To Filter Data use SearchBox</h5>
                    <SearchBox array={this.state.groups} type="groups" sendResults={this.setFilteredGroups}></SearchBox>
                    <Table striped bordered hover size="sm" responsive="md" id = "mmessages">
                        <tbody>
                            <tr>
                               {this.renderTableHeader()}
                               <th key = "options" colSpan="5">Options</th>
                            </tr>
                            {this.renderTableData()}
                        </tbody>
                    </Table>
                    <div align="left">
                        <h4>To create new Group select Create option</h4>
                        <Button variant="primary" onClick={() => this.setStateAction("create")}>Create Group</Button>
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
        case "viewCardSets":
            element = this.openCardSets();
            break;
        case "viewNotebooks":
            element = this.openNotebooks();
            break;
        case "viewMembers":
            element = this.openMembers();
            break;
        default:
            element = <div>Error: this.state.action is not valid.</div>;
            break;
        }
    
        return element;
    }
    //#endregion
}

export default AdminGroupsPanel;