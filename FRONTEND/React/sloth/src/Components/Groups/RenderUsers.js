import React from "react";
import "../../styles/group.css";
import "../../styles/global.css";
/**
 * 
 *  KOMPONENTA RENDERUSERS
 *  
 *  Prikaz username+tag u listi
 * 
 *  props:
 *  onClk - fja iz nadkomponente kojoj se prosledjuje user koji je izabran
 */

const RenderUsers = (props) => {
    const funcOnClk = (event, user) => {
        event.preventDefault();
        props.onClk(user);
    }
    const items = props.users.map((user) => (
        <button
            key={user.id}
            className="btn btn-responsive"
            onClick={(e) => funcOnClk(e,user)}
            style={{backgroundColor: '#ffe123'}}
        >
            {user.username}#
            {user.tag}
        </button>
    ));


    // const items = props.users.map((user) => (
    //     <li key={user.id} className="list-group-item">
    //         <button
    //         key={user.id}
    //         className="btn"
    //         onClick={(e) => funcOnClk(e,user)}
    //         style={{border: '1px solid red'}}
            
    //         >
    //         {user.username}#
    //         {user.tag}
    //         </button>
    //     </li>
    // ));
    // return (<ul className="list-group list-users">
    //     {items}
    // </ul>);
   
   return <div className="overflow-auto"><div className="btn-group-vertical">{items}</div></div>;
};

export default RenderUsers;