import React, {Component} from "react";
import Button from "react-bootstrap/Button";
import ChangeNameForm from "./ChangeNameForm.js";
import GroupInfo from "./GroupInfo.js";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import Dropdown from 'react-bootstrap/Dropdown';

import AddMembersForm from "./AddMembersForm.js";

import MaterialView from "./MaterialView.js";
import MemberInfo from "./MemberInfo.js";

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

/**
 * KOMPONENTA GROUPVIEW
 *  Prikaz grupe
 * 
 *  Props:
 *  group 
 *  user
 */
class GroupView extends Component 
{
    constructor(props){
        super(props);

        this.state = {
            group: props.group,
            view: "group",
            refresh: false,
            


        }        
        this.changeName = this.changeName.bind(this);
        this.viewGroup = this.viewGroup.bind(this);
        this.addMembers = this.addMembers.bind(this);
        this.clickOnUser = this.clickOnUser.bind(this);
    }

    viewGroup()
    {
        this.setState({
            view: "group",
        });
    }
    changeName()
    {
        this.setState({
            view: "change",

        });
    }
    addMembers() 
    {
        this.setState({
            view: "add", 
        })
    }
    clickOnUser(user)
    {
        this.setState({
            view: "user",
            clickedUser: user, //user ciji materijal treba prikazati
        })
    }
    deleteGroup = (event) => {
        event.preventDefault();

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
                    fetch("https://localhost:5001/SLOTH/DeleteGroup/" + this.state.group.id,
                        requestOptions
                    ).then((response) => {
                    if(response.ok){
                        this.props.enterGroupsPanel();
                    }
                    });
                }
              },
              {
                label: 'Nope'
              }
            ]
          });

        

    };

    fetchRemoveMember = (event,user) =>{
        event.preventDefault();

        const requestOptions = {
        method: "Delete",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(),
        };

        fetch("https://localhost:5001/SLOTH/RemoveMembers/" + this.state.group.id + "/" + user.id,
            requestOptions
        ).then((response) => {
            if(response.ok){
                let refreshTemp = !this.state.refresh;
                this.setState({
                    refresh: refreshTemp,
                }, () => this.viewGroup());
                
            }
            else
            {
                confirmAlert({
                    title: 'Error',
                    message: 'There was a problem with the server. We are very sorry and hope to fix it soon!',
                    buttons: [
                      {
                        label: 'Ok'
                        }
                    ]
                  });
            }
        });


    }

    renderGroupNav()
    {
    
        if(this.state.teacher && (this.state.view === "group" || this.state.view === "user"))
        {
            return(<div className="flex-row mt-3 mb-4 border-bottom">
                    <div className="col-1">
                        <IconButton
                            onClick={this.props.enterGroupsPanel}
                            style={{backgroundColor:'transparent'}}>
                            <ArrowBackIcon color="primary"></ArrowBackIcon>
                        </IconButton>
                    </div>
                    <div className="col-9">
                        <h2>{this.state.group.name}</h2>
                    </div>
                    <div className="col-1">
                        <IconButton variant="primary" onClick={this.changeName}>
                            <EditOutlinedIcon color="primary"></EditOutlinedIcon>
                        </IconButton>
                    </div>
                    <div className="col-1">
                        <IconButton variant="danger" onClick={this.deleteGroup}>
                            <DeleteIcon style={{color: "#ff0000"}}></DeleteIcon>
                        </IconButton>
                    </div>
            </div>);
        }
        else
        {
            return(<div className="flex-row border-bottom">
                <div className="col-1">
                    <Button 
                        variant="light"
                        onClick={this.props.enterGroupsPanel}
                        style={{backgroundColor:'transparent'}}>
                        <ArrowBackIcon color="primary"></ArrowBackIcon>
                    </Button>
                </div>
                <div className="col-11"><h2>{this.state.group.name}</h2></div>
            </div>)
        }
    }

    openChangeNameForm()
    {
        return <ChangeNameForm goBack={this.viewGroup} group={this.state.group}></ChangeNameForm>
    }
    openAddMembersForm()
    {
        return <AddMembersForm goBack={this.viewGroup} group={this.state.group}></AddMembersForm>
    }
    
    openGroupMaterial()
    {
        return <MaterialView view="group" group={this.props.group} user={this.props.user} teacher={this.state.teacher}></MaterialView>
    }
    
    openUserMaterial()
    {
        return <React.Fragment>
                    <MemberInfo user={this.state.clickedUser} teacher={this.state.teacher} onClk={this.fetchRemoveMember} goBack={this.viewGroup}></MemberInfo>
                    <MaterialView view="user" group={this.props.group} user={this.props.user} clickedUser={this.state.clickedUser} teacher={this.state.teacher}></MaterialView>
            </React.Fragment>
    }
    componentDidMount()
    {

        if(this.props.group.teacherID === this.props.user.id)
        {
            this.setState({
                teacher: true,
            })
        }
        else 
        {
            this.setState({
                teacher: false,
            })
        }
    }
    render()
    {
        console.log(this.state.teacher);
        let element;
        let nav = this.renderGroupNav();
        
        switch(this.state.view)
        {
            case "change":
                element = this.openChangeNameForm();
                break;
            case "add":
                element = this.openAddMembersForm();
                break;
            case "group":
                element = this.openGroupMaterial();
                break;
            case "user":
                element = this.openUserMaterial();
                break;
            
            default:
                <div>Nothing to render.</div>
                break;
                
        }


        return(
            
            <React.Fragment>
                

                {nav}
                <div className="d-flex flex-row">
                    <div className="col-3 group-info d-none d-md-block">
                        <GroupInfo refresh = {this.state.refresh} addMembers={this.addMembers} user={this.props.user} 
                        group={this.props.group} teacher={this.state.teacher} onClk={this.clickOnUser}></GroupInfo>
                    </div>
                    <div className="d-flex justify-content-start col-sm-3 col-12 d-md-none mb-3"> 
                        <Dropdown>
                         <Dropdown.Toggle variant="success" id="dropdown-basic">
                            Members
                         </Dropdown.Toggle>

                         <Dropdown.Menu>
                           <Dropdown.ItemText><GroupInfo refresh = {this.state.refresh} addMembers={this.addMembers} user={this.props.user} 
                        group={this.props.group} teacher={this.state.teacher} onClk={this.clickOnUser}></GroupInfo></Dropdown.ItemText>
                           
                         </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    <div className="col-sm-9 col-12 container">
                        {element}
                    </div>
                    

                </div>
                
            </React.Fragment>
        )
    }
}

export default GroupView;