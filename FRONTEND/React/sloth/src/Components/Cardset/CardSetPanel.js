import React, { Component } from "react";

import { CardSet } from "../../Models/cardSet.js";

import RenderCardsets from "./RenderCardSets.js";
import CardsetView from "./CardsetView.js";
import CreateCardsetForm from "./CreateCardsetForm";
import CreateCardForm from "./CreateCardForm.js";
import SearchBox from "./SearchBox.js";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";

/**
 * KOMPONENTA CARDSETPANEL:
 *
 * Komponenta za prikaz i interakciju sa flash karticama.
 * Poziva se u SLOTHOVERLORD.
 * ---------------------------------------------------------------------------------------------------------------------
 * Props:
 *   - whose - da li renderuje public cardsets ili user cardsets (public/user/group)
 *   - user - this.props.user je objekat korisnika koji je ulogovan
 *   - groupID - ako je whose = group, prosleđen je groupID
 *   - cardsets - ako je whose = public, onda je ovde prosleđen niz javnih cardsetova
 * ---------------------------------------------------------------------------------------------------------------------
 * State:
 *   - view: panel/cardset/card
 *   - whose: da li su cardsetovi user, public ili group
 *   - action: browse/edit/create
 *   - fetching: da li komponenta čeka na podatke iz baze
 *   - user: postoji ako su cardsets user ili group
 *   - group: postoji ako su cardsets group
 * ---------------------------------------------------------------------------------------------------------------------
 */

class CardSetPanel extends Component {
  constructor(props) {
    super(props);

    switch (props.whose) {
      case "public":
        this.state = {
          view: "panel",
          action: "browse",
          whose: props.whose,
          fetching: true,
          cardsets: [],
          filteredCardsets: [],
        };
        break;
      case "user":
        this.state = {
          view: "panel",
          action: "browse",
          whose: props.whose,
          fetching: true,
          user: props.user,
          cardsets: [],
          filteredCardsets: [],
        };
        break;
      case "group":
        this.state = {
          view: "panel",
          action: "browse",
          whose: props.whose,
          owner: props.owner,
          fetching: true,
          user: props.user,
          groupID: props.groupID,
          cardsets: [],
          filteredCardsets: [],
        };
        break;
      default:
        this.state = {
          view: "error",
        };
    }

    this.enterPanel = this.enterPanel.bind(this);
    this.viewCardSet = this.viewCardSet.bind(this);
    this.viewCard = this.viewCard.bind(this);
    this.createCard = this.createCard.bind(this);
    this.editCardSet = this.editCardSet.bind(this);
    this.setFilteredCardsets = this.setFilteredCardsets.bind(this);
    this.fromCreateCardToCardset = this.fromCreateCardToCardset.bind(this);
    this.setCardset = this.setCardset.bind(this);
  }

  componentDidMount() {

    switch (this.state.whose) {
      case "public":
        this.fetchPublicCardsets();
        break;

      case "user":
        this.fetchUserCardsets();
        break;

      case "group":
        this.fetchGroupCardsets();
        break;

      default:
    }
  }

  //#region State Changers
  enterPanel() {
    this.setState({
      view: "panel",
      action: "browse",
      name: "Card Set Panel",
    });
  }

  setCardset(cs) {
    this.setState({
      cset: cs,
    });
  }

  viewCardSet(cardSet) {

    this.setState({
      view: "cardset",
      action: "browse",
      name: cardSet.title,
      cset: cardSet,
    });
  }

  fromCreateCardToCardset() {
    this.setState({
      action: "browse",
      view: "cardset",
      fetching: false,
    })
  }

  viewCard(card) {
    this.setState({
      view: "card",
      action: "browse",
      card: card,
    });
  }

  createCardSet() {
    this.setState({
      view: "panel",
      action: "create",
    });
  }

  createCard(cardset) {
    this.setState({
      view: "cardset",
      action: "create",
      name: cardset.title,
      cset: cardset,
    });
  }

  editCardSet(cardset) {
    this.setState({
      view: "cardset",
      action: "edit",
      cset: cardset,
    });
  }

  editCard(card) {
    this.setState({
      view: "card",
      action: "edit",
      card: card
    });
  }

  setFilteredCardsets(cardsets) {
    this.setState({
      filteredCardsets: cardsets
    });
  }
  //#endregion

  //#region Fetches
  fetchPublicCardsets() {
    this.setState({
      fetching: true,
    });

    let cardsets = [];
    // fetch code

    fetch("https://localhost:5001/SLOTH/GetPublicCardSets")
      .then((response) => response.json())
      .then((data) => {
        data.forEach((d) => {
          let cset = new CardSet(d.id, d.title, d.color, d.tags, d.groupID, d.grade);
          cset.setVisibility(d.visibility);
          cset.setCategory(d.category);
          cardsets.push(cset);
        });
        this.setState({ cardsets: cardsets, fetching: false, filteredCardsets: cardsets });
      })
      .catch((e) => {
        this.setState({ ...this.state, fetching: false }); // nzm šta znači ova linija
      });
  }

  fetchUserCardsets() {
    this.setState({
      fetching: true,
    });
    let cardsets = [];
    // fetch code

    fetch("https://localhost:5001/SLOTH/GetCardSets/" + this.props.user.id)
      .then((response) => response.json())
      .then((data) => {
        data.forEach((d) => {
          let cset = new CardSet(
            d.cardSet.id,
            d.cardSet.title,
            d.cardSet.color,
            d.cardSet.tags,
            d.cardSet.groupID,
            d.cardSet.grade
          );
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

  fetchGroupCardsets() {
    this.setState({
      fetching: true,
    });

    let cardsets = [];

    if(this.props.toFetch === "group") {
      fetch("https://localhost:5001/SLOTH/GetGroupCardSets/" + this.props.groupID)
            .then((response) => response.json())
            .then((data) => {
                data.forEach((d) => {
                    let cset = new CardSet(d.id, d.title, d.color, d.tags, this.props.groupID, d.grade);
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
    else if(this.props.toFetch === "user") {
      fetch("https://localhost:5001/SLOTH/GetUsersGroupCardSets/" + this.state.groupID +"/"+ this.state.user.id)
      .then((response) => response.json())
      .then((data) => {
        data.forEach((d) => {
          let cset = new CardSet(
            d.cardSet.id,
            d.cardSet.title,
            d.cardSet.color,
            d.cardSet.tags, 
            this.state.groupID,
            d.cardSet.grade
          );
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

    this.setState({fetching: false});
  }
  //#endregion

  //#region Updaters
  updateWhoseChanged(prevProps, prevState) {
    switch (this.props.whose) {
      case "public":
        this.setState({
          view: "panel",
          action: prevState.action,
          whose: this.props.whose,
          fetching: true,
          cardsets: [],
          filteredCardsets: [],
        });
        this.fetchPublicCardsets();
        break;
      case "user":
        this.setState({
          view: "panel",
          action: prevState.action,
          whose: this.props.whose,
          fetching: true,
          user: this.props.user,
          cardsets: [],
          filteredCardsets: [],
        });
        this.fetchUserCardsets();
        break;
      case "group":
        this.setState({
          view: "panel",
          action: prevState.action,
          whose: this.props.whose,
          fetching: true,
          user: this.props.user,
          group: this.props.group,
          cardsets: [],
          filteredCardsets: [],
        });
        this.fetchGroupCardsets();
        break;
      default:
        this.setState({
          view: "error",
        });
    }
  }

  updateActionChanged(prevProps, prevState) {
    if (this.state.action === "browse") {
      let view = prevState.view;
      if(prevState.view === "card") {
        view = "cardset";
      }
      switch (this.props.whose) {
        case "public":
          this.setState({
            view: view,
            action: "browse",
            whose: this.props.whose,
            fetching: true,
            cardsets: [],
            filteredCardsets: [],
          });
          this.fetchPublicCardsets();
          break;
        case "user":
          this.setState({
            view: view,
            action: "browse",
            whose: this.props.whose,
            fetching: true,
            user: this.props.user,
            cardsets: [],
            filteredCardsets: [],
          });
          this.fetchUserCardsets();
          break;
        case "group":
          this.setState({
            view: view,
            action: "browse",
            whose: this.props.whose,
            fetching: true,
            user: this.props.user,
            group: this.props.group,
            cardsets: [],
            filteredCardsets: [],
          });
          this.fetchGroupCardsets();
          break;
        default:
          this.setState({
            view: "error",
          });
      }
    }
  }

  updateViewChanged(prevProps, prevState) {
    if (this.state.view === "panel") {
      switch (this.props.whose) {
        case "public":
          this.setState({
            view: "panel",
            action: prevState.action,
            whose: this.props.whose,
            fetching: true,
            cardsets: [],
            filteredCardsets: [],
          });
          this.fetchPublicCardsets();
          break;
        case "user":
          this.setState({
            view: "panel",
            action: prevState.action,
            whose: this.props.whose,
            fetching: true,
            user: this.props.user,
            cardsets: [],
            filteredCardsets: [],
          });
          this.fetchUserCardsets();
          break;
        case "group":
          this.setState({
            view: "panel",
            action: prevState.action,
            whose: this.props.whose,
            fetching: true,
            user: this.props.user,
            group: this.props.group,
            cardsets: [],
            filteredCardsets: [],
          });
          this.fetchGroupCardsets();
          break;
        default:
          this.setState({
            view: "error",
          });
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.whose != this.props.whose) {
      this.updateWhoseChanged(prevProps, prevState);
    } else if (prevState.action != this.state.action) {
      this.updateActionChanged(prevProps, prevState);
    } else if (prevState.view !== this.state.view) {
      this.updateViewChanged(prevProps, prevState);
    }
  }
  //#endregion

  //#region Event Handlers
  createCardsetHandler = (event) => {
    event.preventDefault();
    this.createCardSet();
  };

  editCardsetHandler = (event) => {
    event.preventDefault();
    this.editCardSet();
  }

  editCardHandler = (event) => {
    event.preventDefault();
    this.editCard()
  }
  //#endregion

  //#region Renders
  renderPanel() {
    if (this.state.fetching) {
      return (<Spinner animation="border" role="status">
      <span className="sr-only">Loading...</span>
    </Spinner>);
    }

    if (this.state.cardsets.length > 0) {
      let btnCreate = <div></div>;
      if (this.state.whose == "user" || this.state.owner) {
        btnCreate = (
          <Button variant="outline-dark" onClick={this.createCardsetHandler}>
            Create New Cardset
          </Button>
        );
      }
      return (
        <React.Fragment>
          <h1 className="display-3">Cardsets</h1>
          {btnCreate}
          <SearchBox array={this.state.cardsets} type="material" sendResults={this.setFilteredCardsets}></SearchBox>
          <Col md={{ span: 4, offset: 4 }}>
          <RenderCardsets
            openCardset={this.viewCardSet}
            cardsets={this.state.filteredCardsets}
          />
          </Col>
        </React.Fragment>
      );
    } else {
      if (this.state.whose === "group" && this.props.toFetch === "user" && !this.state.owner) {
        return <h6 style={{color:"#8300a3"}}>This user has no cardsets.</h6>
      }
      if (this.state.whose === "group" && this.props.toFetch === "group") {
        return <h6 style={{color:"#8300a3"}}>This group has no cardsets.</h6>
      }

      let btnCreate = (
        <div className="container">
          You can make your own cardset by logging in and navigating to{" "}
          <b>My Cardsets</b> page.
        </div>
      );
      if (this.state.whose == "user" || this.state.owner) {
        btnCreate = (
          <Button variant="outline-dark" onClick={this.createCardsetHandler}>
            Create New Cardset
          </Button>
        );
      }
      return (
        <React.Fragment>
          <h2>There are no cardsets available. You can maybe make your own?</h2>
          {btnCreate}
        </React.Fragment>
      );
    }
  }

  renderCardset() {
    return (
      <CardsetView
        whose={this.state.whose}
        owner= {this.props.owner}
        cardset={this.state.cset}
        enterPanel={this.enterPanel}
        createCard={this.createCard}
        editCardSet={this.editCardSet}
        teacher={this.props.teacher}
      ></CardsetView>
    );
  }

  renderCreateCardset() {
    return (
      <CreateCardsetForm
        userID={this.state.user.id}
        groupID={this.props.groupID}
        enterPanel={this.enterPanel}
        viewCardSet={this.viewCardSet}
        setCardset={this.setCardset}
        createCard={this.createCard}
        action="create"
        whose={this.state.whose}
      ></CreateCardsetForm>
    );
  }

  renderCreateCard() {
    return (
      <CreateCardForm
        action="create" 
        cardset={this.state.cset}
        enterPanel={this.enterPanel}
        viewCardSet={this.fromCreateCardToCardset}
      ></CreateCardForm>
    );
  }

  renderEditCardset() {
    return (
      <CreateCardsetForm
        userID={this.state.user.id}
        enterPanel={this.enterPanel}
        viewCardSet={this.fromCreateCardToCardset}
        action="edit"
        cardset={this.state.cset}
      ></CreateCardsetForm>
    );
  }

  renderEditCard() {
    return (
      <CreateCardForm
        action="create" 
        cardset={this.state.cset}
        enterPanel={this.enterPanel}
        viewCardSet={this.fromCreateCardToCardset}
      ></CreateCardForm>
    );
  }

  renderBrowse() {
    if (this.state.view == "panel") {
      return this.renderPanel();
    } else if (this.state.view == "cardset") {
      return this.renderCardset();
    } else {
      return <h4>renderBrowse Error: this.state.view is invalid.</h4>;
    }
  }

  renderCreate() {
    if (this.state.view == "panel") {
      return this.renderCreateCardset();
    } else if (this.state.view == "cardset") {
      return this.renderCreateCard();
    } else {
      return <h4>renderCreate Error: this.state.view is invalid.</h4>;
    }
  }

  renderEdit() {
    if (this.state.view == "cardset") {
      return this.renderEditCardset();
    } else if (this.state.view == "card") {
      return this.renderEditCard();
    } else {
      return <h4>renderEdit Error: this.state.view is invalid.</h4>;
    }
  }

  render() {
    if (this.state.fetching) {
      return (<Spinner animation="border" role="status">
      <span className="sr-only">Loading...</span>
    </Spinner>);
    } else {
      let element;

      switch (this.state.action) {
        case "browse":
          element = this.renderBrowse();
          break;

        case "create":
          element = this.renderCreate();
          break;

        case "edit":
          element = this.renderEdit();
          break;

        default:
          element = <div>Error: this.state.view is not valid.</div>;
          break;
      }
      let btnBack = null;
      if(this.props.whose === "group") {
        btnBack = <Button variant="secondary" onClick={() => this.props.changeShowing("main")}>Back to Group</Button>
      }
      return (
        <React.Fragment>
          {btnBack}
          {element}
        </React.Fragment>
      );
    }
  }
  //#endregion
}

export default CardSetPanel;
