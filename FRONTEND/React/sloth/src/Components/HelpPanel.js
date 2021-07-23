import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card'
import "./../styles/global.css";

class HelpPanel extends Component {
    constructor() {
        super()
    }

    render() {
        return (
        <div className="helppanel">
            <h4>Hello, welcome to the SLOTH Help. We hope you will find what you are looking for. If we missed something be sure to tell us. SLOTH Team</h4>
            <div>
              <h4 style={{background: "#9ee7ffff"}}>Profile</h4>
              <h5>Profile Section lets you have overview of your information and avatar.{"\n"}
                    To change personal information, select Edit Personal Info and fill in the form with new information. {"\n"}
                    To change password, select Password and fill in the form with needed information. {"\n"}
                    To change avatar, select Avatar option and select one of available.
                    We recommed setting up Avatar right after you sign up.</h5>
            </div>
            <div>
              <h4 style={{background: "#ffd296ff"}}>Cardsets</h4>
              <h5>Public Material -{'>'} Cardsets lets you view all public cardsets that have ever been made. Opening the set lets you cycle through cards of the cardset. {"\n"}
                    My Material -{'>'} Cardsets lets you view all cardsets you have made. 
                    Opening the set lets you cycle through cards {"("}if there are cards in the cardset {")"}, edit the set or delete it. 
                    You can also add new card, edit currently showing one or delete it. {"\n"}
                    To create new cardset you need to be logged in and select Create New Cardset in My Material -{'>'} Cardsets and fill in the form with needed information.</h5>
            </div>
            <div>
              <h4 style={{background: "#b5c5ffff"}}>Notebooks</h4>
              <h5>Public Material -{'>'} Notebooks lets you view all public notebooks that have ever been made. Opening the notebook lets you look through notes of the notebook. {"\n"}
                    My Material -{'>'} Notebooks lets you view all notebooks you have made. 
                    Opening the notebook lets you look through notes {"("}if there are notes in the notebook {")"}, edit the notebook or delete it. 
                    You can also add new note, edit selected one or delete it. {"\n"}
                    To create new notebook you need to be logged in and select Create New Notebook in My Material -{'>'} Notebooks and fill in the form with needed information.</h5>
            </div>
            <div>
              <h4 style={{background: "#bafff8ff"}}>Study</h4>
              <h5>Study Section lets you view all study plans you have made. 
                    You can choose to start one, after which it you need to confirm starting by selecting start on the study plan that showed on the right side.
                    To create new study plan select Create New Study and fill in the form with needed information.</h5>
            </div>
            <div>
              <h4 style={{background: "#e5c2ffff"}}>Testing</h4>
              <h5>Testing Section lets you test your knowledge by doing test or playing memory game. {"\n"}
                    For new test you need to selected cardsets that will be used to generate test, choose number of the questions and select Generate Test. {"\n"}
                    After test is generated Start button will be enabled and you can start the test. Each test is choice based and you need to Submit after finishing. You can also review test after submiting. {"\n"}
                    For new memory game you also need to selected cardsets and number of cards to play with. After selecting Sumbit you can play the game that is finished once all pairs are connected.</h5>
            </div>
            <div>
              <h4  style={{background: "#fffac2ff"}}>Groups</h4>
              <h5>Groups Section lets you view all groups you have created or are member of. New Invitations for groups will be shown on the right side of the page and you can either accept or decline each invite.{"\n"}
                    To create new group select Create New Group and fill in the needed information. Note that other users need to accept invite before they become members of the group. 
                    After creating the group you become the Teacher and you have more rights in the group {"("}for example kick members out of the group, edit group name or grade group material{")"}.{"\n"}
                    After selecting one group you can view members of the group, material you made in the group, and all of the material made in the group.{"\n"}
                    After selecting one of the members of the group you can select to view material that member created in the group.{"\n"}
                    To create new material choose My Cardsets or My Notebooks and then select Create New Cardset/Notebook.</h5>
            </div>
            <div>
              <h4  style={{background: "#c2ffccff"}}>Calendar</h4>
              <h5>Calendar Section lets you view all events you have marked. Default view is monthly one but you can see it in yearly and daily view by selecting coressponding option.{"\n"}
                    To add new event select Create New Event and fill in the needed information. To edit or delete event you need to select it first. </h5>
            </div>
        </div>
        )
    }
}

export default HelpPanel