import React, {Component} from "react";
import Members from "./Members.js";
import Button from "react-bootstrap/Button";
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card'



/** KOMPONENTA GROUPINFO
 *  -sadrzi informacije o grupi (ko je teacher, members)
 *  props:
 *  teacher - true/false
 *  group
 * 
 *  state:
 *  fetching
 *  users
 * 
 */
class GroupInfo extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            fetching: true,
            users: [],
            pendingInvitations: [],

        }
    }

    fetchGetMembers()
    {
        this.setState({
            fetching: true,

        });
        fetch("https://localhost:5001/SLOTH/GetMembers/" + this.props.group.id)
            .then(response => response.json())
            .then(data => {
                let teacherTemp = data.find((d) => d.id === this.props.group.teacherID);
                let users = data.filter((d) => d.id !== this.props.user.id && d.id !== this.props.group.teacherID);
                this.setState({users: users, teacher: teacherTemp, fetching: false});
            })
            .catch(e =>{
                this.setState({...this.state, fetching: false});
            })
    }

    fetchPendingInvitations()
    {
        this.setState({
            fetching: true,
        });

        fetch("https://localhost:5001/SLOTH/PendingInvitations/" + this.props.group.id)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    pendingInvitations: data, fetching: false
                });
            })
            .catch(e => {
                this.setState({...this.state, fetching: false});
            })
    }

    componentDidMount()
    {
        this.fetchGetMembers();
        if(this.props.teacher)
            this.fetchPendingInvitations();
    }

    componentDidUpdate(prevProps)
    {
        if(this.props !== prevProps && this.props.teacher)
        {
            this.fetchPendingInvitations();
        }

        if(this.props.refresh !== prevProps.refresh)
        {
            this.fetchGetMembers();
            if(this.props.teacher)
                this.fetchPendingInvitations();
        }
    }

    renderTeacher()
    {
        return(<React.Fragment>
            <div className="d-flex flex-row">
            <div className="col-9 align-center"><h5>Members</h5></div>
            <div className="col-3">
                <IconButton
                    onClick = {this.props.addMembers}>
                    <AddIcon fontSize="small"></AddIcon>
                </IconButton>
            </div>
            </div>
        </React.Fragment>)
    }
    renderStudent()
    {
        
        return(<React.Fragment>
                    <h5>Members</h5>
                    <div className="d-flex flex-row flex-wrap">
                        <div className="col-xl-4"><h6>Teacher:</h6></div>
                        <div className="col-xl-8">
                            <Button
                                className="btn"
                                onClick={(e) => this.onClick(e, this.state.teacher)}>
                                    {this.state.teacher.username}
                                    {this.state.teacher.tag}

                            </Button>
                        </div>
                    </div>
        </React.Fragment>)
    }

    onClick = (event, user) =>
    {
        event.preventDefault();
        this.props.onClk(user);
    }

    pendingOnClick = (event, user) => 
    {

    }

    render()
    {
        console.log(this.state.teacher);
        if(this.state.fetching)
        {
            return <h1>Fetching data...</h1>
        }

        let element = null;
        let pending = null;
        if(this.props.teacher)
        {
            element = this.renderTeacher();
            if(this.state.pendingInvitations.length !== 0)
            {
                pending = <div>
                    <hr />
                    <h5>Pending Invitations</h5>
                    <Members disabled={true} users={this.state.pendingInvitations} onClk={this.pendingOnClick()}></Members>
                </div>
            }
        }
        else
        {
            element = this.renderStudent();
        }


        return(
            <React.Fragment>
                <div className="d-flex flex-column">
                    {element}
                    <Members disabled={false} users={this.state.users} onClk={this.onClick}></Members>
                    {pending}
                </div>
          </React.Fragment>
        )

    }

}

export default GroupInfo;