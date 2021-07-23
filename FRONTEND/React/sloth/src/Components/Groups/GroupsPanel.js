import React, { Component } from "react";
import {Group} from "../../Models/group.js";
import ViewGroups from "./ViewGroups.js";
import CreateGroupForm from "./CreateGroupForm.js";

import Button from "react-bootstrap/Button";
import GroupView from "./GroupView.js";

/**
 * KOMPONENTA GROUPPANEL
 * 
 *  Props:
 *  user
 * 
 *  State:
 *  view: panel 
 *
 */
class GroupsPanel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            view: "panel",
            fetching: true,
            groups:[],
        };

        this.enterPanel = this.enterPanel.bind(this);
        this.createGroup = this.createGroup.bind(this);
        this.addGroup = this.addGroup.bind(this);
        this.viewGroup = this.viewGroup.bind(this);
    }

    enterPanel(){
        this.setState({
            view: "panel"
        })
    }
    createGroup(){
        this.setState({
            view: "create",
            //mozda groups na []
        })
    }
    viewGroup(group){
        this.setState({
            view: "group",
            group: group,

        })
    }

    addGroup(group)
    {
        let groups = this.state.groups;
        if(!groups.includes(group))
            groups.push(group);
        this.setState({
            groups: groups,

        })
    }

    openPanel(){
        if(this.state.fetching){
            return <h1>Fetching data...</h1>
        }

        let element = (
            <div>
                <Button variant = "outline-dark" onClick = {this.createGroup}>
                    Create New Group
                </Button>
            </div>
        );
        if(this.state.groups.length > 0)
        {
            return (<React.Fragment>
                {element}
                <ViewGroups groups={this.state.groups} viewGroup={this.viewGroup}></ViewGroups>
            </React.Fragment>);
        }
        else
        {
            return (<React.Fragment>
                <h2>There are no groups available. You can maybe make your own? </h2>
                {element}
            </React.Fragment>)
        }
    }

    openCreateForm()
    {
        return <CreateGroupForm userID={this.props.user.id} goBack={this.enterPanel}
                addGroup={this.addGroup}></CreateGroupForm>
    }

    openGroupView()
    {
        return <GroupView enterGroupsPanel={this.enterPanel} user ={this.props.user} group={this.state.group}></GroupView>
    }

    fetchGroups(){
        this.setState({
            fetching:true,
        });

        let groups = [];

        fetch("https://localhost:5001/SLOTH/GetGroups/" + this.props.user.id)
            .then(response => response.json())
            .then(data => {
                data.forEach(gr => {
                    let newGroup = new Group(gr.id, gr.teacherID, gr.name);

                    if(!groups.includes(newGroup))
                        groups.push(newGroup);
                });
                this.setState({groups: groups, fetching:false});
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
                this.fetchGroups();
                break;
            case "create":
                break;
            default:
                break;
        }
    }

    componentDidUpdate(prevProps, prevState)
    {
        if(prevState.view !== this.state.view && this.state.view === "panel")
            this.fetchGroups();
    }
    render() {
        let element = null;
        switch(this.state.view)
        {
            case "panel":
                element = this.openPanel();
                break;
            case "create":
                element = this.openCreateForm();
                break;
            case "group":
                element = this.openGroupView();
                break;
            default:
                element = <div>Nothing to render.</div>
                break;
        }

        return <div>
            {element}
        </div>


    }
}

export default GroupsPanel;