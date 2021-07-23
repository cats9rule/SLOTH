import React, {Component} from "react";
import "../../styles/global.css";

/**
 * KOMPONENTA MEMBERS
 * 
 *  Prikaz svih clanova grupe - svaki user je poseban button
 * 
 *  props:
 *  users -
 *  onClk (event, user) - fja iz nadkomponente koja se poziva na klik odredjenom usera
 *  disabled - true/false
 * 
 */

class Members extends Component {
    constructor(props)
    {
        super(props);
        this.state = {

        }
    }

    funcOnClk(event, user)
    {
        event.preventDefault();

        this.props.onClk(event, user);
    }
    
    render()
    {
        const items = this.props.users.map((user) => (
            <button
                key={user.id}
                className="btn btn-light w-100 btn-responsive"
                onClick={(e) => this.funcOnClk(e,user)}
                // style={{border: '1px solid red'}}
                disabled = {this.props.disabled}
                
            >
                {user.username}#
                {user.tag}
            </button>
        ));
        return <div className="group-info-users">
            {items}
            </div>;


    }

    componentDidMount() {
        
    }
}

export default Members;