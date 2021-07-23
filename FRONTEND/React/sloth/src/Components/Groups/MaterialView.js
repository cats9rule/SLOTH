import React, { Component } from "react";
import CardSetPanel from "../Cardset/CardSetPanel";
import NotebookPanel from "../Notebook/NotebookPanel";

/**
 * KOMPONENTA MATERIALVIEW
 *
 * Props:
 *  group -
 *  user -
 *  clickedUser - user ciji materijal treba da se prikaze
 *  view - group/user
 *
 * State:
 *  view
 *      group - osnovni pregled : my cs, my nb, group cs, group nb
 *      user - pregled materijala odredjenog user-a
 *  showing: da li se prikazuju cardsets/notebooks ili početni meni
 */

class MaterialView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: this.props.user,
      group: this.props.group,
      view: this.props.view,
      clickedUser: this.props.clickedUser,
      showing: "main",
    };

    this.changeShowing = this.changeShowing.bind(this);
  }

  //#region State Changers

  changeShowing = (showing) => {
      this.setState({showing: showing});
  } 

  //#endregion

  //#region Renders
  groupMaterialView() {
    return (
      <div className="flex-col">
        <div className="flex-row">
          <div className="col-6">
            <button
              className="btn btn-dark"
              onClick={() => this.changeShowing("mycardsets")}
            >
              My CardSets
            </button>
          </div>
          <div className="col-6">
            <button
              className="btn btn-dark"
              onClick={() => this.changeShowing("mynotebooks")}
            >
              My Notebooks
            </button>
          </div>
        </div>
        <div className="flex-row">
          <div className="col-6">
            <button
              className="btn btn-dark"
              onClick={() => this.changeShowing("groupcardsets")}
            >
              Group CardSets
            </button>
          </div>
          <div className="col-6">
            <button
              className="btn btn-dark"
              onClick={() => this.changeShowing("groupnotebooks")}
            >
              Group Notebooks
            </button>
          </div>
        </div>
      </div>
    );
  }

  userMaterialView() {
    return (
      <div className="flex-col">
        <div className="flex-row">
          <div className="col-6">
            <button
              className="btn btn-dark"
              onClick={() => this.changeShowing("membercardsets")}
            >
              Member CardSets
            </button>
          </div>
          <div className="col-6">
            <button
              className="btn btn-dark"
              onClick={() => this.changeShowing("membernotebooks")}
            >
              Member Notebooks
            </button>
          </div>
        </div>
      </div>
    );
  }

  renderMyCardsets() {
    return (
        <CardSetPanel changeShowing={this.changeShowing} whose="group" toFetch="user" user={this.state.user} owner={true} groupID={this.state.group.id} teacher={this.props.teacher}></CardSetPanel>
    )
  }

  renderMyNotebooks() {
    return (
        <NotebookPanel  changeShowing={this.changeShowing} whose="group"  toFetch="user" user={this.state.user} owner={true} groupID={this.state.group.id} teacher={this.props.teacher}></NotebookPanel>
    )
  }

  renderGroupCardsets() {
    return (
        <CardSetPanel changeShowing={this.changeShowing} whose="group"  toFetch="group" user={this.state.user} owner={false} groupID={this.state.group.id} teacher={this.props.teacher}></CardSetPanel>
    )
  }

  renderGroupNotebooks() {
    return (
        <NotebookPanel changeShowing={this.changeShowing} whose="group" toFetch="group" user={this.state.user} owner={false} groupID={this.state.group.id} teacher={this.props.teacher}></NotebookPanel>
    )
  }

  renderUserCardsets() {
    return (
        <CardSetPanel changeShowing={this.changeShowing} whose="group" toFetch="user" user={this.state.clickedUser} owner={false} groupID={this.state.group.id} teacher={this.props.teacher}></CardSetPanel>
    )
  }

  renderUserNotebooks() {
    return (
        <NotebookPanel changeShowing={this.changeShowing} whose="group" toFetch="user" user={this.state.clickedUser} owner={false} groupID={this.state.group.id} teacher={this.props.teacher}></NotebookPanel>
    )
  }
  //#endregion

  componentDidUpdate(prevProps, prevState) {
    if (prevProps !== this.props) {
      this.setState({
        view: this.props.view,
        clickedUser: this.props.clickedUser,
      });
    }
  }

  render() {
    let element = null;
    if (this.state.view === "group") {
      switch (this.state.showing) {
        case "main":
          element = this.groupMaterialView();
          break;
        case "mycardsets":
          element = this.renderMyCardsets();
          break;
        case "mynotebooks":
          element = this.renderMyNotebooks();
          break;
        case "groupcardsets":
          element = this.renderGroupCardsets();
          break;
        case "groupnotebooks":
          element = this.renderGroupNotebooks();
          break;
      }
    } else if (this.state.view === "user") {
      switch (this.state.showing) {
        case "main":
          element = this.userMaterialView();
          break;
        case "membercardsets":
          element = this.renderUserCardsets();
          break;
        case "membernotebooks":
          element = this.renderUserNotebooks();
          break;
      }
    }

    return <React.Fragment>{element}</React.Fragment>;
  }
}

export default MaterialView;
