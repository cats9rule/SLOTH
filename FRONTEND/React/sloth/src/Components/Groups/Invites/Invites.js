import React, {Component} from 'react'
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import RenderInvites from "./RenderInvites.js";

import {Group} from "../../../Models/group.js";


class Invites extends Component {
    constructor(props){
        super(props);
        
        this.state = {
            fetching: false,
            invites: [],
            variant: "",
            open: false,

        }

        this.acceptInvite = this.acceptInvite.bind(this);
        this.declineInvite = this.declineInvite.bind(this);
        this.toastOnClose = this.toastOnClose.bind(this);
    }

    checkInvites(){
        this.interval = setInterval(() => {
            this.fetchCheckInvites();
        }, 60000);
    }

    openInvites(event)
    {
        event.preventDefault();

        this.setState((prevState) => ({
            open: !prevState.open,
            variant: "",

        }));
    }
    acceptInvite(invite)
    {
        let inv = this.state.invites.filter(el => el !== invite);
                    this.setState({
                        invites: inv,
                        fetching: false,
                        newInvites: 0,
                    })
    }
    declineInvite(invite)
    {
        let inv = this.state.invites.filter(el => el !== invite);
                this.setState({
                    invites: inv,
                    fetching: false,
                });
    }
    toastOnClose(invite)
    {
        let inv = this.state.invites.filter(el => el !== invite);
        this.setState({
            invites: inv,
        });
    }

    fetchCheckInvites()
    {
        this.setState({
            fetching: true,

        });

        let inv = [];

        fetch("https://localhost:5001/SLOTH/CheckInvites/" + this.props.user.id)
            .then(response => response.json())
            .then(data => {
                data.forEach(element => {
                    let invite = new Group(element.id, element.teacherID, element.name);
                    if(!inv.some(item => (item.id === invite.id)))
                        inv.push(invite);
                    
                });
                this.setState({
                    invites: inv,
                    fetching: false,
                })

            })
            .catch(e => {
                console.log(e);
                this.setState({...this.state, fetching: false});
            })
    }

    
    componentDidMount()
    {
        this.fetchCheckInvites();
        this.checkInvites();
    }

    componentDidUpdate(prevProps, prevState)
    {
        if(this.state.invites.length > prevState.invites.length)
        {
            this.setState({
                newInvites: this.state.invites.length - prevState.invites.length,
                variant: "danger",
            })
        }
    }

    componentWillUnmount()
    {
        clearInterval(this.interval);
    }

    render()
    {
        let element = null;
        let badge = null;
        if(this.state.open)
        {
            
            element = <React.Fragment>
                <RenderInvites user={this.props.user} declineInvite={this.declineInvite} 
                    acceptInvite={this.acceptInvite} invites={this.state.invites}
                    toastOnClose={this.toastOnClose}></RenderInvites>
            </React.Fragment>
        }

        if(this.state.variant === "danger")
        {
            badge = <Badge variant={this.state.variant}>{this.state.newInvites}</Badge>;
        }
        return(<div>
            <div className="flex-row">
                <Button variant="light" className="w-100"
                    onClick={(event) => this.openInvites(event)}>
                    Invitations {badge}
                </Button>
            </div>
            {element}
            
        </div>
            )
    }
}
export default Invites;