import React, { Component } from "react";
import ColorPicker from "./../Cardset/ColorPicker";
import TagInput from "./../Cardset/TagInput";

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";

import "../../styles/global.css";
import "../../styles/animations.css";
import { Notebook } from "../../Models/notebook";

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

class CreateNotebookForm extends Component {
  constructor(props) {
    super(props);
    if (props.action === "create") {
      this.state = {
        action: "create",
        title: "My Notebook",
        tags: [],
        category: 1,
        visibility: 0,
      };
    } else if (props.action === "edit") {
      console.log(props);
      this.state = {
        action: "edit",
        title: props.notebook.title,
        tags: props.notebook.tags,
        category: props.notebook.category.value,
        visibility: props.notebook.visibility.value,
      };
    }

    this.categories = [
      { name: "Natural Sciences", value: 1 },
      { name: "Technology And Engineering", value: 2 },
      { name: "Medical Sciences", value: 3 },
      { name: "Social Sciences", value: 4 },
      { name: "Humanities", value: 5 },
      { name: "Other", value: 6 },
    ];

    this.deselectTag = this.deselectTag.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {}

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

  //#region Event Handlers
  setPublic = () => {
    this.setState({ visibility: 1 });
  };

  setPrivate = () => {
    this.setState({ visibility: 2 });
  };

  setGroup = () => {
    this.setState({ visibility: 3 });
  };

  categoryChangeHandler = (event) => {
    this.setState({ category: event.target.value });
  };

  titleChangeHandler = (event) => {
    this.setState({ title: event.target.value });
  };

  deselectTag(tag) {
    let tags = this.state.tags.filter((t) => t !== tag);
    this.setState({ tags: tags });
  }

  createNotebook = (event) => {
    event.preventDefault();
    if (this.state.category === 0) {
      confirmAlert({
        title: 'You missed something',
        message: 'You need to set a category for the cardset.',
        buttons: [
          {
            label: 'Ok'
          }
        ]
      });
      return;
    }
    if (this.state.visibility === 0 && this.props.whose !== "group") {
      confirmAlert({
        title: 'You missed something',
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
      this.fetchCreateNotebook();
    }
    else if(this.props.whose === "group") {
      this.fetchCreateGroupNotebook();
    }
  };

  editNotebook = (event) => {
    event.preventDefault();
    if (this.state.csCategory === 0) {
      confirmAlert({
        title: 'You missed something',
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
        title: 'You missed something',
        message: 'You need to choose a visibility option.',
        buttons: [
          {
            label: 'Ok'
          }
        ]
      });
      return;
    }
    this.fetchEditNotebook();
  };
  //#endregion

  //#region Fetches
  fetchCreateNotebook = () => {
    let vis = 3;
    if (this.props.whose !== "group") {
      vis = this.state.visibility;
    }
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: this.state.title,
        tags: this.state.tags,
        category: this.state.category,
        visibility: vis,
      }),
    };

    const fetchFunction = async () => {
      const response = await fetch(
        "https://localhost:5001/SLOTH/CreateNotebook/" + this.props.userID,
        requestOptions
      );
      if (response.ok) {
        response.json().then((p) => {
          this.setState({ newNotebookID: p });
          console.log(p);
          this.props.enterPanel();
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

  fetchCreateGroupNotebook = () => {

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: this.state.title,
        tags: this.state.tags,
        category: this.state.category,
        visibility: 3,
        groupID: this.props.groupID
      }),
    };

    const fetchFunction = async () => {
      const response = await fetch(
        "https://localhost:5001/SLOTH/CreateNotebookInGroup/" + this.props.userID,
        requestOptions
      );
      if (response.ok) {
        response.json().then((p) => {
          this.setState({ newNotebookID: p });
          console.log(p);
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

  fetchEditNotebook = () => {
    let vis = 3;
    if (this.props.whose !== "group") {
      vis = this.state.visibility;
    }
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: this.props.notebook.id,
        title: this.state.title,
        tags: this.state.tags,
        category: this.state.category,
        visibility: vis,
      }),
    };

    console.log(requestOptions);

    const fetchFunction = async () => {
      const response = await fetch(
        "https://localhost:5001/SLOTH/UpdateNotebook/",
        requestOptions
      );
      if (response.ok) {
        this.props.viewNotebook(this.props.notebook);
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
        <p className="display-4">Create New Notebook</p>
        <Form className="container pt-5" onSubmit={this.createNotebook}>
          <Form.Group as={Row}>
            <Form.Label column sm={2}>
              Title:
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                required
                aria-describedby="title-helpblock"
                value={this.state.title}
                onChange={this.titleChangeHandler}
              />
              <Form.Text id="title-helpblock" muted>
                Title must not contain any special characters.
              </Form.Text>
            </Col>
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
                selectedTags={this.state.tags}
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
              checked={this.state.visibility === 1}
              onChange={this.setPublic}
            />
          </Col>
          <Col sm={2}>
            <Form.Check
              type="radio"
              label="Private"
              name="formHorizontalRadios"
              id="formHorizontalRadios2"
              checked={this.state.visibility === 2}
              onChange={this.setPrivate}
            />
          </Col>
        </Form.Group>
      );
    }

    return (
      <React.Fragment>
        <p className="display-4">Edit Notebook</p>
        <Form className="container pt-5" onSubmit={this.editNotebook}>
          <Form.Group as={Row}>
            <Form.Label column sm={2}>
              Title:
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                required
                aria-describedby="title-helpblock"
                value={this.state.title}
                onChange={this.titleChangeHandler}
              />
              <Form.Text id="title-helpblock" muted>
                Title must not contain any special characters.
              </Form.Text>
            </Col>
          </Form.Group>

          {radios}

          <Form.Group as={Row}>
            <Form.Label column sm={2}>
              Category:
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                as="select"
                onChange={this.categoryChangeHandler}
                value={this.state.category}
              >
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
                selectedTags={this.state.tags}
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
  //#endregion

  render() {
    let element = null;
    if (this.state.action === "create") {
      element = this.renderCreate();
    } else if (this.state.action === "edit") {
      element = this.renderEdit();
    } else {
      element = (
        <div>
          CreateNotebookForm Error: this.props.action is not valid.
          <br />
          this.props.action: {this.props.action}
        </div>
      );
    }

    return element;
  }
}

export default CreateNotebookForm;
