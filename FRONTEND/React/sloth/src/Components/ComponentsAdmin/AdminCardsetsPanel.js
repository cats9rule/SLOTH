import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import AdminCardsPanel from "./AdminCardsPanel.js";
import CardSetForm from "./CardSetForm.js";
import SearchBox from "../Cardset/SearchBox.js";
import { CardSet } from "../../Models/cardSet.js";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

class AdminCardsetsPanel extends Component {
    constructor(props) {
        super(props);

        if(this.props.action === "forUser") {
            this.state = {
                view: "default",
                action: "forUser",
                forUser: true,
                forGroup: false,
                userid: this.props.userid,
                cardsets: [],
                filteredCardsets: [],
                fetching: true
            };
        }
        else if (this.props.action === "forGroup") {
            this.state = {
                view: "default",
                action: "forGroup",
                forUser: false,
                forGroup: true,
                groupid: this.props.groupid,
                cardsets: [],
                filteredCardsets: [],
                fetching: true
            };
        }
        else {
            this.state = {
                view: "default",
                action: "browse",
                userid: "",
                forUser: false,
                forGroup: false,
                cardsets: [],
                filteredCardsets: [],
                fetching: true,
                count: 0
            };
        }

        this.setStateAction = this.setStateAction.bind(this);
        this.setFilteredCardsets = this.setFilteredCardsets.bind(this);
    }

    //#region StateSetting
    setStateAction(clicked) {
        switch(clicked)
        {
            case "create":
                this.setState({action: "create", forUser: false, forGroup: false});
                break;
            case "edit":
                this.setState({action: "edit"});
                break;
            case "view":
                this.setState({action: "view"});
                break;
            case "forUser":
                this.setState({action: "forUser", forUser: true, forGroup:false,});
                this.fetchUserCardSets();
                break;
            case "forGroup":
                this.setState({action: "forUser", forUser: false, forGroup:true});
                this.fetchGroupCardSets();
                break;
            case "forUserCreate":
                this.setState({action: "create", forUser: true, forGroup:false, userid: this.props.userid});
                break;
            case "forGroupCreate":
                this.setState({action: "create", forUser: false, forGroup: true, groupid: this.props.userid});
                break;
            default:
                if (this.state.forUser === false && this.state.forGroup === false)    
                {
                    this.setState({action: "browseAfter"});
                    this.fetchCardSets();
                }
                else if (this.state.forUser === true && this.state.forGroup === false)    
                {
                    this.setState({action: "forUser"});
                    this.fetchUserCardSets();
                }
                else if (this.state.forUser === false && this.state.forGroup === true)
                {
                    this.setState({action: "forGroup"});
                    this.fetchGroupCardSets();
                }    
                break;
        }
    }

    setFilteredCardsets(cardsets) {
        this.setState({ filteredCardsets: cardsets});
    }
    //#endregion

    //#region FetchingFunctions
    fetchCardSets() {
        this.setState({fetching:true});
        let cardsets = [];
        fetch("https://localhost:5001/SLOTH/GetAllCardSets")
            .then(response => response.json())
            .then(data => {
                data.forEach(cs => {
                    let cardset = new CardSet(cs.id, cs.title, cs.color, cs.tags);
                    cardset.setVisibility(cs.visibility);
                    cardset.setCategory(cs.category);
                    cardsets.push(cardset);
                });
                this.setState({cardsets: cardsets, fetching:false, filteredCardsets: cardsets, count: cardsets.length});
            })
            .catch(e => {
                this.setState({...this.state, fetching:false});
            })
    }

    fetchUserCardSets() {
        this.setState({fetching:true});
        let cardsets = [];
        fetch("https://localhost:5001/SLOTH/GetCardSets/" + this.props.userid)
            .then((response) => response.json())
            .then((data) => {
                data.forEach((d) => {
                    let cset = new CardSet(d.cardSet.id, d.cardSet.title, d.cardSet.color, d.cardSet.tags);
                    cset.setVisibility(d.cardSet.visibility);
                    cset.setCategory(d.cardSet.category);
                    cardsets.push(cset);
                });
                this.setState({ cardsets: cardsets, fetching: false , filteredCardsets: cardsets });
            })
            .catch((e) => {
                this.setState({ ...this.state, fetching: false });
            });
    }

    fetchGroupCardSets() {
        this.setState({fetching:true});
        let cardsets = [];
        fetch("https://localhost:5001/SLOTH/GetGroupCardSets/" + this.props.groupid)
            .then((response) => response.json())
            .then((data) => {
                data.forEach((d) => {
                    let cset = new CardSet(d.id, d.title, d.color, d.tags);
                    cset.setVisibility(d.visibility);
                    cset.setCategory(d.category);
                    cardsets.push(cset);
                });
                this.setState({ cardsets: cardsets, fetching: false , filteredCardsets: cardsets });
            })
            .catch((e) => {
                this.setState({ ...this.state, fetching: false });
            });
    }
    //#endregion

    componentDidMount() {
        if(this.state.action !== "forUser" && this.state.action !== "forGroup")
            this.fetchCardSets();
        else if (this.state.action === "forUser")
            this.fetchUserCardSets();
        else
            this.fetchGroupCardSets();
    }

    //#region Functions
    openFormForCreate() {
        return <CardSetForm setStateAction = {this.setStateAction}
                            action="create"
                            forUser = {this.state.forUser}
                            forGroup = {this.state.forGroup}
                            userid = {this.state.userid}
                            groupid = {this.props.groupid}>
                </CardSetForm>
    }

    openFormForEdit() {
        return <CardSetForm setStateAction = {this.setStateAction}
                            action = "edit"
                            cardset = {this.state.cardsets[this.state.index]}>
                </CardSetForm>
    }

    openCards() {
        return <AdminCardsPanel setStateAction = {this.setStateAction}
                                cardsetid = {this.state.cardsets[this.state.index].id}
                                color = {this.state.cardsets[this.state.index].color}>
               </AdminCardsPanel>
    }

    viewSelected(index) {
        this.setStateAction("view");
        this.setState({index: index});
    }

    editSelected(index) {
        this.setStateAction("edit");
        this.setState({index: index});
    }

    deleteSelected(index) {
        this.setState({index: index});
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
                    fetch("https://localhost:5001/SLOTH/DeleteCardSet/" + this.state.cardsets[index].id, requestOptions)
                        .then(response => {
                            if(response.ok) {
                                if(this.state.action == "forGroup")
                                    this.fetchGroupCardSets();
                                else if (this.state.action == "forUser")
                                    this.fetchUserCardSets();
                                else
                                    this.fetchCardSets();
                            }  
                            else
                                alert("response was not ok");
                        })}
              },
              {
                label: 'Nope'
              }
            ]
          });
    }
    //#endregion

    //#region RenderFunctions
    renderTableHeader() {
        let forHeader = Object.keys(this.state.cardsets[0]).filter(key => key !== "cards");
        let header = forHeader;
        return header.map((key, index) => {
            if (key.toUpperCase() === "ID") 
                return <th key = {index} style={{backgroundColor:"#a0a6b0"}}>{key.toUpperCase()}</th>
            else
                return <th key = {index}>{key.toUpperCase()}</th>
        })
    }

    renderTableData() {
        return this.state.filteredCardsets.map((cardset, index) => {
            const {id, title, color, tags, category, visibility} = cardset;
            return (
                <tr>
                    <td style={{backgroundColor:"#a0a6b0"}}>{id}</td>
                    <td>{title}</td>
                    <td style={{backgroundColor:color}}>{color}</td>
                    <td>{tags.toString()}</td>
                    <td>{category.value}</td>
                    <td>{visibility.value}</td>
                    <td><Button variant="primary" onClick={() => this.viewSelected(index)}>View Cards</Button></td>
                    <td><Button variant="primary" onClick={() => this.editSelected(index)}>Edit</Button></td>
                    <td><Button variant="danger" onClick={() => this.deleteSelected(index)}>Delete</Button></td>
                </tr>
            )
        })
    }

    renderBrowse() {
        let element;
        if (this.state.fetching) {
            element = <h3>We are getting cardsets ready wait a bit</h3>;
        }
        else
        {
            if(this.state.cardsets.length === 0)
            {
                element = 
                <div>
                    <div>
                        <h3>Cardsets not found in the database. Why not create one?</h3> 
                        <Button variant="primary" onClick={() => this.setStateAction("create")}>Create Cardset</Button>
                    </div>
                    <div>
                        <h3>To go back to Main Admin Panel select Go Back option</h3>
                        <Button variant="primary" onClick={this.props.setStateView}>Go back</Button>
                    </div>
                </div>
            }
            else
            {
                element = 
                <div>
                    <h3>All Cardsets in database</h3>
                    <h5>Currently count of Cardsets in database is: {this.state.count}</h5>
                    <h5>To Filter Data use SearchBox</h5>
                    <SearchBox array={this.state.cardsets} type="material" sendResults={this.setFilteredCardsets}></SearchBox>
                    <Table striped bordered hover size="sm" responsive="md" id = "mmessages">
                        <tbody>
                            <tr>
                               {this.renderTableHeader()}
                               <th key = "options" colSpan="3">Options</th>
                            </tr>
                            {this.renderTableData()}
                        </tbody>
                    </Table>
                    <div align="left">
                        <h4>To create new Cardset select Create option</h4>
                        <Button variant="primary" onClick={() => this.setStateAction("create")}>Create Cardset</Button>
                    </div>
                    <div align="left">
                        <h4>To go back to Main Admin Panel select Go Back option</h4>
                        <Button variant="primary" onClick={this.props.setStateView}>Go back</Button>
                    </div>
                </div>
            }
        }
        return element;
    }

    renderBrowseForUser() {
        let element;
        if (this.state.fetching) {
            element = <h3>We are getting cardsets ready wait a bit</h3>;
        }
        else
        {
            if(this.state.cardsets.length === 0)
            {
                element = 
                <div>
                    <div>
                        <h3>Cardsets not found for selected User. Why not create one?</h3> 
                        <Button variant="primary" onClick={() => this.setStateAction("forUserCreate")}>Create Cardset</Button>
                    </div>
                    <div>
                        <h3>To go back to Main Admin Panel select Go Back option</h3>
                        <Button variant="primary" onClick={this.props.setStateAction}>Go back</Button>
                    </div>
                </div>
            }
            else
            {
                element = 
                <div>
                    <h3>All Cardsets for selected User</h3>
                    <h5 align="left">To Filter Data use SearchBox</h5>
                    <SearchBox array={this.state.cardsets} type="material" sendResults={this.setFilteredCardsets}></SearchBox>
                    <Table striped bordered hover size="sm" responsive="md" id = "mmessages">
                        <tbody>
                            <tr>
                               {this.renderTableHeader()}
                               <th key = "options" colSpan="3">Options</th>
                            </tr>
                            {this.renderTableData()}
                        </tbody>
                    </Table>
                    <div align="left">
                        <h4>To create new Cardset select Create option</h4>
                        <Button variant="primary" onClick={() => this.setStateAction("forUserCreate")}>Create Cardset</Button>
                    </div>
                    <div align="left">
                        <h4>To go back to Main Panel select Go Back option</h4>
                        <Button variant="primary" onClick={this.props.setStateAction}>Go back</Button>
                    </div>
                </div>
            }
        }
        return element;
    }

    renderBrowseForGroup() {
        let element;
        if (this.state.fetching) {
            element = <h3>We are getting cardsets ready wait a bit</h3>;
        }
        else
        {
            if(this.state.cardsets.length === 0)
            {
                element = 
                <div>
                    <div>
                        <h3>Cardsets not found for selected Group. Why not create one?</h3> 
                        <Button variant="primary" onClick={() => this.setStateAction("forGroupCreate")}>Create Cardset</Button>
                    </div>
                    <div>
                        <h3>To go back to Main Admin Panel select Go Back option</h3>
                        <Button variant="primary" onClick={this.props.setStateAction}>Go back</Button>
                    </div>
                </div>
            }
            else
            {
                element = 
                <div>
                    <h3>All Cardsets for selected Group</h3>
                    <h5 align="left">To Filter Data use SearchBox</h5>
                    <SearchBox array={this.state.cardsets} type="material" sendResults={this.setFilteredCardsets}></SearchBox>
                    <Table striped bordered hover size="sm" responsive="md" id = "mmessages">
                        <tbody>
                            <tr>
                               {this.renderTableHeader()}
                               <th key = "options" colSpan="3">Options</th>
                            </tr>
                            {this.renderTableData()}
                        </tbody>
                    </Table>
                    <div align="left">
                        <h4>To create new Cardset select Create option</h4>
                        <Button variant="primary" onClick={() => this.setStateAction("forGroupCreate")}>Create Cardset</Button>
                    </div>
                    <div align="left">
                        <h4>To go back to Main Panel select Go Back option</h4>
                        <Button variant="primary" onClick={this.props.setStateAction}>Go back</Button>
                    </div>
                </div>
            }
        }
        return element;
    }

    render() {
        let element;
        switch(this.state.action) {
        case "browse":  
            element = this.renderBrowse();
            break;
        case "edit":
            element = this.openFormForEdit();
            break;
        case "create":
            element = this.openFormForCreate();
            break;
        case "browseAfter":
            element = this.renderBrowse();
            break;
        case "view":
            element = this.openCards();
            break;
        case "forUser":
            element = this.renderBrowseForUser();
            break;
        case "forGroup":
            element = this.renderBrowseForGroup();
            break;
        default:
            element = <div>Error: this.state.view is not valid.</div>;
            break;
        }
    
        return element;
    }
    //#endregion
}

export default AdminCardsetsPanel;