import React, { Component } from "react";
import ColorPicker from "../Cardset/ColorPicker";
import TagInput from "../Cardset/TagInput";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import "../../styles/global.css";
import "../../styles/animations.css";
import { CardSet } from "../../Models/cardSet";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

class CardSetForm extends Component {
    constructor(props) {
        super(props);
        if(this.props.action === "create") {
          this.state = {
            action: "create",
            userid: this.props.userid,
            groupid: this.props.groupid,
            csTitle: "New Cardset",
            csColor: "#fffefaff",
            color: "#fffefaff",
            csTags: [],
            csCategory: 1,
            csVisibility: 0,
          };
        }
        else if(this.props.action === "edit") {
          this.state = {
            action: "edit",
            csTitle: this.props.cardset.title,
            csColor: this.props.cardset.color,
            color: this.props.cardset.color,
            csTags: this.props.cardset.tags,
            csCategory: this.props.cardset.category.value,
            csVisibility: this.props.cardset.visibility.value,
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

        this.onColorChange = this.onColorChange.bind(this);
        this.deselectTag = this.deselectTag.bind(this);
        this.useridChangeHandler = this.useridChangeHandler.bind(this);
    }

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

    useridChangeHandler = (event) => {
        this.setState({userid: event.target.value})
    }
    
    componentDidUpdate(prevProps, prevState) {
        if (prevState.csColor != this.state.csColor) {
          this.setState({ color: this.state.csColor });
        }
    }

    fetchCreateCardSet = () => {
        let cardset = null;
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: this.state.csTitle,
            color: this.state.csColor,
            tags: this.state.csTags,
            category: this.state.csCategory,
            visibility: this.state.csVisibility
          }),
        };
    
        const fetchFunction = async () => {
          const response = await fetch(
            "https://localhost:5001/SLOTH/CreateCardset/" + this.state.userid, requestOptions
          );
          if (response.ok) {
            response.json().then((p) => {
              this.setState({ newCardsetID: p });
              this.props.setStateAction();
            });
          }
        };
    
        fetchFunction();
    };

    fetchCreateGroupCardSet() {
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
          groupID: this.props.groupid
        }),
      };
      const fetchFunction = async () => {
        const response = await fetch(
          "https://localhost:5001/SLOTH/CreateCardsetInGroup/" + this.state.userid, requestOptions
        );
        if (response.ok) {
          response.json().then((p) => {
            this.setState({ newCardsetID: p });
            this.props.setStateAction();
          });
        }
      };
  
      fetchFunction();
    }

    fetchEditCardSet = () => {
      let vis = 3;
        if (this.props.forGroup === false) {
          vis = this.state.visibility;
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
            visibility: vis
          }),
        };
    
        const fetchFunction = async () => {
          const response = await fetch(
            "https://localhost:5001/SLOTH/UpdateCardset/",
            requestOptions
          );
          if (response.ok) {
            this.props.setStateAction();
          } 
        };
    
        fetchFunction();
    }

    createCardset = (event) => {
        event.preventDefault();
        if (this.state.csCategory === 0) {
          return;
        }
        if (this.state.csVisibility === 0 && this.props.forGroup === false) {
          return;
        }
        if(this.props.forGroup === false)
          this.fetchCreateCardSet();
        else 
          this.fetchCreateGroupCardSet();
    };

    editCardset = (event) => {
        event.preventDefault();
        if (this.state.csCategory === 0) {
          return;
        }
        if (this.state.csVisibility === 0 && this.props.forGroup === false) {
          return;
        }
        this.fetchEditCardSet();
    };

    cancel(action) {
      confirmAlert({
        title: 'Confirm to cancel',
        message: 'You sure you want to cancel?',
        buttons: [
          {
            label: 'Yup',
            onClick: () => {
                this.props.setStateAction(action);
            }
          },
          {
            label: 'Nope'
          }
        ]
      });
    }

    renderCreate() {
        let categories = this.categories.map((obj) => (
          <option key={obj.value} value={obj.value}>
            {obj.name}
          </option>
        ));
    
        let radios = <div></div>;
    
        if (this.props.forGroup === false && this.props.forUser === false) {
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
            <h3>Create Card Set</h3>
            <Form className="container pt-5" onSubmit={this.createCardset}>
              {this.props.forUser === false &&
              <Form.Group as={Row}>
                <Form.Label column sm={2}>
                    User ID:
                </Form.Label>
                <Col sm={10}>
                    <Form.Control required 
                                  aria-describedby="userid-helpblock"
                                  value={this.state.userid}
                                  onChange={this.useridChangeHandler}/>
                    <Form.Text id="userid-helpblock" muted>
                    User ID must be number and exisiting in database.
                    If creating for a Group it will be TeacherID.
                    </Form.Text>
                </Col>
              </Form.Group>
              }
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
                {this.props.forUser === false && 
                <Button variant="danger" onClick={() => this.cancel("")}>
                  Cancel
                </Button>}
                {this.props.forUser === true &&
                <Button variant="danger" onClick={() => this.cancel("forUser")}>
                Cancel
                </Button>}
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
    
        if (this.props.forGroup === false && this.props.forUser === false) {
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
            <h3>Edit Card Set</h3>
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
                  Update
                </Button>
                <Button variant="danger" onClick={() => this.cancel("")}>
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
}

export default CardSetForm;
