import React, {Component} from "react";
import "../../styles/group.css";
import ListGroup from "react-bootstrap/ListGroup";
/**
 * KOMPONENTA VIEWGROUPS 
 * 
 * Prikaz svih grupa 
 * 
 * props:
 * groups - niz grupa
 * viewGroup
 */

class ViewGroups extends Component{
    constructor(props)
    {
        super(props);
        this.state = {

        }
    }

    render(){
        const items = this.props.groups.map((group) => (
            <div key ={group.id} className="group">
            <button className="btn btn-one-group"
            onClick={() => this.props.viewGroup(group)}>
                {group.name}
            </button>
            </div>
        ));

        return <div className="container-fluid viewGroups">{items}</div>
    }
}
export default ViewGroups;