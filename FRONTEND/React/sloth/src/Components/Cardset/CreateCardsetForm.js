import React, { Component } from "react";
import ColorPicker from "./ColorPicker";
import TagInput from "./TagInput";

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";

import "../../styles/global.css";
import "../../styles/animations.css";
import { CardSet } from "../../Models/cardSet";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

class CreateCardsetForm extends Component {
  constructor(props) {
    super(props);
    if(props.action === "create") {
      this.state = {
        action: "create",
        csTitle: "My Cardset",
        csColor: "#fffefaff",
        color: "#fffefaff",
        csTags: [],
        csCategory: 1,
        csVisibility: 0,
      };
    }
    else if(props.action === "edit") {
      this.state = {
        action: "edit",
        csTitle: props.cardset.title,
        csColor: props.cardset.color,
        color: props.cardset.color,
        csTags: props.cardset.tags,
        csCategory: props.cardset.category.value,
        csVisibility: props.cardset.visibility.value,
      };
    }
    else {
      
    }
    

    this.categories = [
      { name: "Natural Sciences", value: 1 },
      { name: "Technology And Engineering", value: 2 },
      { name: "Medical Sciences", value: 3 },
      { name: "Social Sciences", value: 4 },
      { name: "Humanities", value: 5 },
      { name: "Other", value: 6 },
    ];
    this.onColorChange = this.onColorChange.bind(this);
    this.deselectTag = this.deselectTag.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.csColor != this.state.csColor) {
      this.setState({ color: this.state.csColor });
    }
  }

  cancel() {
    confirmAlert({
      title: 'Confirm to cancel',
      message: 'You sure you want to cancel?',
      buttons: [
        {
          label: 'Yup',
          onClick: () => {
            this.props.enterPanel();
          }
        },
        {
          label: 'Nope'
        }
      ]
    });
  }

  //#region State Changers
  setPublic = () => {
    this.setState({ csVisibility: 1 });
  };

  setPrivate = () => {
    this.setState({ csVisibility: 2 });
  };

  setGroup = () => {
    this.setState({ csVisibility: 3 });
  };

  categoryChangeHandler = (event) => {
    this.setState({ csCategory: event.target.value });
  };

  csTitleChangeHandler = (event) => {
    this.setState({ csTitle: event.target.value });
  };

  csColorChangeHandler = (event) => {
    this.setState({ color: event.target.value });
    if (/^#[0-9A-F]{8}$/i.test(event.target.value)) {
      this.setState({ csColor: event.target.value });
    }
  };

  onColorChange = (color) => {
    this.setState({
      csColor: color.hex8String,
    });
  };

  deselectTag(tag) {
    let tags = this.state.csTags.filter((t) => t !== tag);
    this.setState({ csTags: tags });
  }
  //#endregion

  //#region Fetches
  fetchCreateCardset = () => {
    let cardset = null;

    let vis = 3;
    if (this.props.whose !== "group") {
      vis = this.state.csVisibility;
    }
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: this.state.csTitle,
        color: this.state.csColor,
        tags: this.state.csTags,
        category: this.state.csCategory,
        visibility: vis,
      }),
    };

    const fetchFunction = async () => {
      const response = await fetch(
        "https://localhost:5001/SLOTH/CreateCardset/" + this.props.userID,
        requestOptions
      );
      if (response.ok) {
        response.json().then((p) => {
          this.setState({ newCardsetID: p });
          this.props.enterPanel();
          confirmAlert({
            title: 'Success',
            message: 'The cardset was created successfully!',
            buttons: [
              {
                label: 'Ok'
                }
            ]
          });
        });
      } else {
        confirmAlert({
          title: 'Error',
          message: 'There was a problem with the server. We are very sorry and hope to fix it soon!',
          buttons: [
            {
              label: 'Ok'
              }
          ]
        });
      }
    };

    fetchFunction();
  };

  fetchEditCardset = () => {
    let vis = 3;
    if (this.props.whose !== "group") {
      vis = this.state.csVisibility;
    }
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: this.props.cardset.id,
        title: this.state.csTitle,
        color: this.state.csColor,
        tags: this.state.csTags,
        category: this.state.csCategory,
        visibility: vis,
        groupID: this.props.cardset.groupID
      }),
    };

    const fetchFunction = async () => {
      const response = await fetch(
        "https://localhost:5001/SLOTH/UpdateCardset/",
        requestOptions
      );
      if (response.ok) {
        let cardset = this.props.cardset;
        cardset.title = this.state.csTitle;
        cardset.title = this.state.csTitle;
        cardset.color = this.state.csColor;
        cardset.tags = this.state.csTags;
        cardset.setCategory(this.state.csCategory);
        cardset.setVisibility(this.state.csVisibility);
        this.props.viewCardSet(cardset);
      } else {
        confirmAlert({
          title: 'Error',
          message: 'There was a problem with the server. We are very sorry and hope to fix it soon!',
          buttons: [
            {
              label: 'Ok'
              }
          ]
        });
      }
    };

    fetchFunction();
  }

  fetchCreateGroupCardset = () => {
      let cardset = null;
  
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: this.state.csTitle,
          color: this.state.csColor,
          tags: this.state.csTags,
          category: this.state.csCategory,
          visibility: 3,
          groupID: this.props.groupID
        }),
      };
  
      const fetchFunction = async () => {
        const response = await fetch(
          "https://localhost:5001/SLOTH/CreateCardsetInGroup/" + this.props.userID,
          requestOptions
        );
        if (response.ok) {
          response.json().then((p) => {
            this.setState({ newCardsetID: p });

          });
        } else {
          confirmAlert({
            title: 'Error',
            message: 'There was a problem with the server. We are very sorry and hope to fix it soon!',
            buttons: [
              {
                label: 'Ok'
                }
            ]
          });
        }
      };
  
      fetchFunction();
  }

  fetchWithCreatingCardsUser() {
    let cardset = null;

    let vis = 3;
    if (this.props.whose !== "group") {
      vis = this.state.csVisibility;
    }
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: this.state.csTitle,
        color: this.state.csColor,
        tags: this.state.csTags,
        category: this.state.csCategory,
        visibility: vis,
      }),
    };

    fetch(
      "https://localhost:5001/SLOTH/CreateCardset/" + this.props.userID,
      requestOptions
    ).then((response) => {
      if (response.ok) {
        // ovde treba da se kreira cardset objekat i prosledi overlordu, koji treba da renderuje i create cards formu

        response.json().then((p) => {

          const cardset = new CardSet(
            p,
            this.state.csTitle,
            this.state.csColor,
            this.state.csTags
          );
          cardset.setCategory(this.state.csCategory);
          cardset.setVisibility(this.state.csVisibility);
          this.props.setCardset(cardset);
          this.props.createCard(cardset);
        });
      } else {
        confirmAlert({
          title: 'Error',
          message: 'There was a problem with the server. We are very sorry and hope to fix it soon!',
          buttons: [
            {
              label: 'Ok'
              }
          ]
        });
      }
    });
  }

  fetchWithCreatingCardsGroup() {
    let cardset = null;

    let vis = 3;
    if (this.props.whose !== "group") {
      vis = this.state.csVisibility;
    }
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: this.state.csTitle,
          color: this.state.csColor,
          tags: this.state.csTags,
          category: this.state.csCategory,
          visibility: 3,
          groupID: this.props.groupID
      }),
    };

    fetch(
      "https://localhost:5001/SLOTH/CreateCardsetInGroup/" + this.props.userID,
      requestOptions
    ).then((response) => {
      if (response.ok) {
        // ovde treba da se kreira cardset objekat i prosledi overlordu, koji treba da renderuje i create cards formu

        response.json().then((p) => {

          const cardset = new CardSet(
            p,
            this.state.csTitle,
            this.state.csColor,
            this.state.csTags,
            this.props.groupID
          );
          cardset.setCategory(this.state.csCategory);
          cardset.setVisibility(this.state.csVisibility);
          this.props.setCardset(cardset);
          this.props.createCard(cardset);
        });
      } else {
        confirmAlert({
          title: 'Error',
          message: 'There was a problem with the server. We are very sorry and hope to fix it soon!',
          buttons: [
            {
              label: 'Ok'
              }
          ]
        });
      }
    });
  }
  //#endregion

  //#region Event Handlers
  createCardset = (event) => {
    event.preventDefault();
    if (this.state.csCategory === 0) {
      confirmAlert({
        title: 'Error',
        message: 'You need to set a category for the cardset.',
        buttons: [
          {
            label: 'Ok'
            }
        ]
      });
      return;
    }
    if (this.state.csVisibility === 0 && this.props.whose !== "group") {
      confirmAlert({
        title: 'Error',
        message: 'You need to choose a visibility option.',
        buttons: [
          {
            label: 'Ok'
            }
        ]
      });
      return;
    }

    if(this.props.whose === "user") {
      this.fetchCreateCardset();
    }
    else if(this.props.whose === "group") {
      this.fetchCreateGroupCardset();
    }
  };

  createAndCards = (event) => {
    event.preventDefault();

    if (this.state.csCategory === 0) {
      confirmAlert({
        title: 'Error',
        message: 'You need to set a category for the cardset.',
        buttons: [
          {
            label: 'Ok'
            }
        ]
      });
      return;
    }
    if (this.state.csVisibility === 0 && this.props.whose !== "group") {
      confirmAlert({
        title: 'Error',
        message: 'You need to choose a visibility option.',
        buttons: [
          {
            label: 'Ok'
            }
        ]
      });
      return;
    }
    if(this.props.whose === "user") {
      this.fetchWithCreatingCardsUser();
    }
    else if(this.props.whose === "group") {
      this.fetchWithCreatingCardsGroup();
    }

  };

  editCardset = (event) => {
    event.preventDefault();
    if (this.state.csCategory === 0) {
      confirmAlert({
        title: 'Error',
        message: 'You need to set a category for the cardset.',
        buttons: [
          {
            label: 'Ok'
            }
        ]
      });
      return;
    }
    if (this.state.csVisibility === 0) {
      confirmAlert({
        title: 'Error',
        message: 'You need to choose a visibility option.',
        buttons: [
          {
            label: 'Ok'
            }
        ]
      });
      return;
    }
    this.fetchEditCardset();
  }
  //#endregion

  //#region Renders
  renderCreate() {
    let categories = this.categories.map((obj) => (
      <option key={obj.value} value={obj.value}>
        {obj.name}
      </option>
    ));

    let radios = <div></div>;

    if (this.props.whose !== "group") {
      radios = (
        <Form.Group as={Row}>
          <Col sm={2}>
            <Form.Label>Access:</Form.Label>
          </Col>
          <Col sm={2}>
            <Form.Check
              type="radio"
              label="Public"
              name="formHorizontalRadios"
              id="formHorizontalRadios1"
              onChange={this.setPublic}
            />
          </Col>
          <Col sm={2}>
            <Form.Check
              type="radio"
              label="Private"
              name="formHorizontalRadios"
              id="formHorizontalRadios2"
              onChange={this.setPrivate}
            />
          </Col>
        </Form.Group>
      );
    }

    return (
      <React.Fragment>
        <p className="display-4">Create New Card Set</p>
        <Form className="container pt-5" onSubmit={this.createCardset}>
          <Form.Group as={Row}>
            <Form.Label column sm={2}>
              Title:
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                required
                aria-describedby="title-helpblock"
                value={this.state.csTitle}
                onChange={this.csTitleChangeHandler}
              />
              <Form.Text id="title-helpblock" muted>
                Title must not contain any special characters.
              </Form.Text>
            </Col>
          </Form.Group>

          <Form.Group as={Row}>
            <Form.Label column sm={2}>
              Color:
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                required
                aria-describedby="color-helpblock"
                value={this.state.color}
                onChange={this.csColorChangeHandler}
                style={{ background: `${this.state.csColor}` }}
              />
              <Form.Text id="color-helpblock" muted>
                Please choose a color for your card set.
              </Form.Text>
            </Col>
            <div className="container-fluid flex-centered">
              <ColorPicker
                color={this.state.csColor}
                onColorChange={this.onColorChange}
              ></ColorPicker>
            </div>
          </Form.Group>

          {radios}

          <Form.Group as={Row}>
            <Form.Label column sm={2}>
              Category:
            </Form.Label>
            <Col sm={10}>
              <Form.Control as="select" onChange={this.categoryChangeHandler}>
                {categories}
              </Form.Control>
            </Col>
          </Form.Group>

          <Form.Group as={Row}>
            <Form.Label column sm={2}>
              Tags:
            </Form.Label>
            <Col sm={5}>
              <TagInput
                selectedTags={this.state.csTags}
                deselectTag={this.deselectTag}
              ></TagInput>
            </Col>
          </Form.Group>
          <Row>
            <Button variant="success" type="submit">
              Create
            </Button>
            
            <Button variant="danger" onClick={() => this.cancel()}>
              Cancel
            </Button>
          </Row>
        </Form>
      </React.Fragment>
    );
  }

  renderEdit() {
    let categories = this.categories.map((obj) => (
      <option key={obj.value} value={obj.value}>
        {obj.name}
      </option>
    ));

    let radios = <div></div>;

    if (this.props.whose !== "group") {
      radios = (
        <Form.Group as={Row}>
          <Col sm={2}>
            <Form.Label>Access:</Form.Label>
          </Col>
          <Col sm={2}>
            <Form.Check
              type="radio"
              label="Public"
              name="formHorizontalRadios"
              id="formHorizontalRadios1"
              checked={this.state.csVisibility === 1}
              onChange={this.setPublic}
            />
          </Col>
          <Col sm={2}>
            <Form.Check
              type="radio"
              label="Private"
              name="formHorizontalRadios"
              id="formHorizontalRadios2"
              checked={this.state.csVisibility === 2}
              onChange={this.setPrivate}
            />
          </Col>
        </Form.Group>
      );
    }

    return (
      <React.Fragment>
        <p className="display-4">Edit Card Set</p>
        <Form className="container pt-5" onSubmit={this.editCardset}>
          <Form.Group as={Row}>
            <Form.Label column sm={2}>
              Title:
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                required
                aria-describedby="title-helpblock"
                value={this.state.csTitle}
                onChange={this.csTitleChangeHandler}
              />
              <Form.Text id="title-helpblock" muted>
                Title must not contain any special characters.
              </Form.Text>
            </Col>
          </Form.Group>

          <Form.Group as={Row}>
            <Form.Label column sm={2}>
              Color:
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                required
                aria-describedby="color-helpblock"
                value={this.state.color}
                onChange={this.csColorChangeHandler}
                style={{ background: `${this.state.csColor}` }}
              />
              <Form.Text id="color-helpblock" muted>
                Please choose a color for your card set.
              </Form.Text>
            </Col>
            <div className="container-fluid flex-centered">
              <ColorPicker
                color={this.state.csColor}
                onColorChange={this.onColorChange}
              ></ColorPicker>
            </div>
          </Form.Group>

          {radios}

          <Form.Group as={Row}>
            <Form.Label column sm={2}>
              Category:
            </Form.Label>
            <Col sm={10}>
              <Form.Control as="select" onChange={this.categoryChangeHandler} value={this.state.csCategory}>
                {categories}
              </Form.Control>
            </Col>
          </Form.Group>

          <Form.Group as={Row}>
            <Form.Label column sm={2}>
              Tags:
            </Form.Label>
            <Col sm={5}>
              <TagInput
                selectedTags={this.state.csTags}
                deselectTag={this.deselectTag}
              ></TagInput>
            </Col>
          </Form.Group>
          <Row>
            <Button variant="success" type="submit">
              Save
            </Button>
            <Button variant="danger" onClick={() => this.cancel()}>
              Cancel
            </Button>
          </Row>
        </Form>
      </React.Fragment>
    );
  }

  render() {
    let element = null;
    if(this.state.action === "create") {
      element = this.renderCreate();
    }
    else if(this.state.action === "edit") {
      element = this.renderEdit();
    }
    else {
      element = <div>CreateCardsetForm Error: this.props.action is not valid.<br />this.props.action: {this.props.action}</div>
    }

    return element;
  }
  //#endregion
}

export default CreateCardsetForm;
