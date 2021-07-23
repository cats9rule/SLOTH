import React, {Component} from "react";
import Toast from 'react-bootstrap/Toast';
import Button from 'react-bootstrap/Button';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';

/**
 * KOMPONENTA RENDERINVITES
 * 
 *  Props:
 *  invites
 */

class RenderInvites extends Component {
    constructor(props)
    {
        super(props);

        this.state = {

        }
    }

    acceptInvite = (event, invite) => {
        event.preventDefault();

       this.fetchAcceptInvite(invite);
    }

    declineInvite = (event, invite) => {
        event.preventDefault();

        this.fetchDeclineInvite(invite);
        
    }


    fetchAcceptInvite(invite)
    {
        this.setState({
            fetching: true,
        });

        fetch("https://localhost:5001/SLOTH/AcceptInvite/" + this.props.user.id + "/" + invite.id)
            .then(response => {
                if(response.ok)
                {
                    this.props.acceptInvite(invite);
                }
            })
            .catch(e => {
                console.log(e);
                this.setState({...this.state, fetching:false})
            })
            
    }

    fetchDeclineInvite(invite)
    {
        this.setState({
            fetching: true,

        });
        fetch("https://localhost:5001/SLOTH/DeclineInvite/" + this.props.user.id + "/" + invite.id)
        .then(response => {
            if(response.ok)
            {
                this.props.declineInvite(invite);
            }
        })
        .catch(e => {
            console.log(e);
            this.setState({...this.state, fetching:false})
        })
    }

    render()
    {
        const items = this.props.invites.map((invite) => (
            <Toast onClose={() => this.props.toastOnClose(invite)}>
                <Toast.Header closeButton={false}>
                    <strong className="mr-auto">New invite</strong>
                </Toast.Header>
                <Toast.Body>
                    <div>
                    <strong className="mr-auto">Group:</strong> <p>{invite.name}</p>
                    </div>
                    <div>
                        <Button variant="light"
                            onClick={(event) => this.acceptInvite(event, invite)}>
                            <CheckIcon style={{ color: "#00cc33"}}></CheckIcon>
                        </Button>
                        <Button variant="light"
                            onClick={(event) => this.declineInvite(event, invite)}>
                            <ClearIcon style={{ color: "#ff0000"}}></ClearIcon>
                        </Button>
                    </div>
                </Toast.Body>
            </Toast>
        ));

        return <div>{items}</div>
    }
}
export default RenderInvites;