import React, { Component } from "react";
import AdminCalendarsPanel from "./AdminCalendarsPanel";
import AdminCardsetsPanel from "./AdminCardsetsPanel";
import AdminGroupsPanel from "./AdminGroupsPanel";
import AdminMotivationalMessagesPanel from "./AdminMotivationalMessagesPanel";
import AdminNotebooksPanel from "./AdminNotebooksPanel";
import AdminStudyPlansPanel from "./AdminStudyPlansPanel";
import AdminUsersPanel from "./AdminUsersPanel";
import NewAdminForm from "./NewAdminForm";
import Button from "react-bootstrap/Button";

class AdminPanel extends Component {
    constructor(props) {
        super(props);
        this.admin = this.props.admin;
        this.state = {
            view: "default",
            action: "browser",
        };

        this.setStateView = this.setStateView.bind(this);
    }

    addNewAdmin() {
        return <NewAdminForm setStateView = {this.setStateView}
                             action="create">
               </NewAdminForm>
    }

    promoteUser() {
        return <NewAdminForm setStateView = {this.setStateView}
                             action="promote">
               </NewAdminForm>
    }

    setStateView(clicked) {
        switch(clicked)
        {
            case "newadmin":
                this.setState({view: "newadmin", action: "create"});
                break;
            case "promote":
                this.setState({view: "promote", action: "create"});
                break;
            case "users":
                this.setState({view: "users"});
                break;
            case "groups":
                this.setState({view: "groups"});
                break;
            case "cardsets":
                this.setState({view: "cardsets"});
                break;
            case "notebooks":
                this.setState({view: "notebooks"});
                break;
            case "mmessages":
                this.setState({view: "mmessages"});
                break;
            case "studyplans":
                this.setState({view: "studyplans"});
                break;
            case "calendars":
                this.setState({view: "calendars"});
                break;
            default:
                this.setState({view: "default", action: "browser"});
                break;
                
        }
    }

    openAdminUsersPanel() {
        return <AdminUsersPanel setStateView = {this.setStateView}></AdminUsersPanel>
    }

    openAdminGroupsPanel() {
        return <AdminGroupsPanel setStateView = {this.setStateView}></AdminGroupsPanel>
    }

    openAdminCardsetsPanel() {
        return <AdminCardsetsPanel setStateView = {this.setStateView}></AdminCardsetsPanel>
    }

    openAdminNotebooksPanel() {
        return <AdminNotebooksPanel setStateView = {this.setStateView} action="browse"></AdminNotebooksPanel>
    }

    openAdminMotivationalMessagesPanel() {
        return <AdminMotivationalMessagesPanel setStateView = {this.setStateView}
                                               setMMChanged = {this.props.setMMChanged}>
               </AdminMotivationalMessagesPanel>
    }

    openAdminStudyPlansPanel() {
        return <AdminStudyPlansPanel setStateView = {this.setStateView}></AdminStudyPlansPanel>
    }

    openAdminCalendarPanel() {
        return <AdminCalendarsPanel setStateView = {this.setStateView}></AdminCalendarsPanel>
    }

    render() {
        let element;
        switch(this.state.view)
        {
            case "default":
                element = 
                <div>
                    <h3>This is admin panel. Current admin is {this.admin.username}</h3>
                    <h4>You can add new Admin or promote existing user.</h4> 
                    <Button variant="primary" onClick={() => this.setStateView("newadmin")}> Add New User</Button>
                    <Button variant="primary" onClick={() => this.setStateView("promote")}> Promote User</Button>
                    <h4>To access any data choose right option below</h4>
                    <Button variant="primary" onClick={() => this.setStateView("users")}> Users</Button>
                    <Button variant="primary" onClick={() => this.setStateView("groups")}> Groups</Button>
                    <Button variant="primary" onClick={() => this.setStateView("cardsets")}> Cardsets</Button>
                    <Button variant="primary" onClick={() => this.setStateView("notebooks")}> Notebooks</Button>
                    <Button variant="primary" onClick={() => this.setStateView("mmessages")}> Motivational Messages</Button>
                    <Button variant="primary" onClick={() => this.setStateView("studyplans")}> Study Plans</Button>
                    {/*<Button variant="primary" onClick={() => this.setStateView("calendars")}> Events</Button>*/}
                </div>
                break;
            case "newadmin":
                element = this.addNewAdmin();
                break;
            case "promote":
                element = this.promoteUser();
                break;
            case "users":
                element = this.openAdminUsersPanel();
                break;
            case "groups":
                element = this.openAdminGroupsPanel();
                break;
            case "cardsets":
                element = this.openAdminCardsetsPanel();
                break;
            case "notebooks":
                element = this.openAdminNotebooksPanel();
                break;
            case "mmessages":
                element = this.openAdminMotivationalMessagesPanel();
                break;
            case "studyplans":
                element = this.openAdminStudyPlansPanel();
                break;
            case "calendars":
                element = this.openAdminCalendarPanel();
                break;
            default:
                element = <div>Error: this.state.view is not valid.</div>;
                break;
        }
        return element;
    }
}

export default AdminPanel;