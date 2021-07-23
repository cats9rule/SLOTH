import React, {Component} from "react";
import Toast from 'react-bootstrap/Toast';
import { ToastHeader } from 'react-bootstrap';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

/** KOMPONENTA MEMBERINFO
 *  - informacije o izabranom clanu grupe 
 *                  + KICK OUT ako je teacher
 * 
 *  Props:
 *  
 */
class MemberInfo extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            user: this.props.user,

        }
    }

    componentDidUpdate(prevProps, prevState)
    {
        if(prevProps.user !== this.props.user)
        {
            this.setState({
                user: this.props.user,
            })
        }
    }

    render()
    {
        let element = null;
        if(this.props.teacher)
        {
            element=<button
                className="btn btn-danger"
                onClick={(e) => this.props.onClk(e, this.state.user)}>
                Kick Out
            </button>
        }

        // return (
        //     <Toast onClose={() => this.props.goBack()}>
        //         <ToastHeader></ToastHeader>
        //         <div>
        //              <h5>{this.state.user.username}#{this.state.user.tag}</h5>
        //              <h6>First Name: {this.state.user.firstName}</h6>
        //              <h6>Last Name: {this.state.user.lastName}</h6>
        //              {element}
        //          </div>
        //     </Toast>
        //)
        return(
            <React.Fragment>
                <div className="d-flex justify-content-end">
                    <IconButton onClick={this.props.goBack}><CloseIcon></CloseIcon>
                    </IconButton></div>
                <div>
                    <h5>{this.state.user.username}#{this.state.user.tag}</h5>
                    <h6>First Name: {this.state.user.firstName}</h6>
                    <h6>Last Name: {this.state.user.lastName}</h6>
                    {element}
                </div>

            </React.Fragment>
        )

    }

}
export default MemberInfo;