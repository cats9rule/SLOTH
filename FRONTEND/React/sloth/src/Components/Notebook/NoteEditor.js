import React, { Component } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import SunEditor, { buttonList } from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";

import "./../../styles/global.css";

import { Note } from "../../Models/note";

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

export class NoteEditor extends Component {
  constructor(props) {
    super(props);

    this.notebook = props.notebook;

    if (props.note) {
      this.state = {
        notebook: props.notebook,
        note: props.note,
        backup: props.note.text,
        title: props.note.title,
      };
    } else {
      const n = new Note(-1, "", "");
      this.state = {
        notebook: props.notebook,
        note: n,
        backup: props.contents,
        title: "",
      };
    }

    this.editor = React.createRef();
    this.save = this.save.bind(this);
    this.discard = this.discard.bind(this);
  }

  //#region Fetches

  fetchCreate = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: this.editor.current.getContents(),
        title: this.state.title,
      }),
    };

    const fetchFunction = async () => {
      const response = await fetch(
        "https://localhost:5001/SLOTH/CreateNote/" + this.props.notebook.id,
        requestOptions
      );
      if (response.ok) {
        response.json().then((id) => {
          let note = new Note(id, this.state.title, this.state.text);
          this.setState({
            note: note,
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

  fetchEdit = () => {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: this.props.note.id,
        text: this.editor.current.getContents(),
        title: this.state.title,
      }),
    };

    const fetchFunction = async () => {
      const response = await fetch(
        "https://localhost:5001/SLOTH/UpdateNote/",
        requestOptions
      );
      if (response.ok) {
        let note = new Note(
          this.state.note.id,
          this.state.title,
          this.editor.current.getContents()
        );
        this.setState({
          note: note,
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

  //#endregion

  //#region Event Handlers
  titleChangeHandler = (event) => {
    this.setState({ title: event.target.value });
  };

  back = (event) => {
    event.preventDefault();

    confirmAlert({
      title: 'Confirm to go back',
      message: 'You sure you want go back?',
      buttons: [
        {
          label: 'Yup',
          onClick: () => {
            this.props.viewNotebook(this.notebook);
          }
        },
        {
          label: 'Nope'
        }
      ]
    });

    
  }

  save = (event) => {
    event.preventDefault();

    if(this.state.title === "") {
      return;
    }

    if (this.props.action === "create") {
      this.fetchCreate();
    } else if (this.props.action === "edit") {
      this.fetchEdit();
    }
    this.setState({backup: this.editor.current.getContents()});
  };

  discard = (event) => {
    event.preventDefault();

    confirmAlert({
      title: 'Confirm to cancel',
      message: 'You sure you want to cancel?',
      buttons: [
        {
          label: 'Yup',
          onClick: () => {
            let title = this.state.note.title;

            this.setState({
              title: title,
            });

            //za ovo pokazuje da ne moze da dodbije current
            this.editor.current.setContents(this.state.backup);
          }
        },
        {
          label: 'Nope'
        }
      ]
    });

  };
  //#endregion

  // The sunEditor parameter will be set to the core suneditor instance when this function is called
  getSunEditorInstance = (sunEditor) => {
    this.editor.current = sunEditor;
    this.editor.current.setContents(this.state.note.text);
  };

  render() {

    let btnDiscard = null;
    if(this.state.note.id !== -1) {
      btnDiscard = (<Button className="margin-5" variant="danger" onClick={this.discard}>
      Discard
    </Button>);
    }
    return (
      <div>
        <Form onSubmit={this.save}>
          <Form.Group as={Row} className="margin-5" controlId="title">
            <Form.Label column sm={2}>
              Title
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                type="text"
                required
                placeholder="New Title"
                value={this.state.title}
                onChange={this.titleChangeHandler}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="justify-content-between">
            <Col sm={6}>
            <IconButton className="margin-5" variant="secondary" onClick={this.back}>
              <ArrowBackIcon></ArrowBackIcon>
            </IconButton>
            </Col>
            <Col sm={6}>
              <Button className="margin-5" variant="success" type="submit">
                Save
              </Button>
              {btnDiscard}
            </Col>
          </Form.Group>
        </Form>
        <SunEditor
          getSunEditorInstance={this.getSunEditorInstance}
          setOptions={{
            height: "100%",
            buttonList: [
              // default
              ["undo", "redo"],
              [
                "font",
                "fontSize",
                "formatBlock",
                "paragraphStyle",
                "blockquote",
              ],
              [
                "bold",
                "underline",
                "italic",
                "strike",
                "subscript",
                "superscript",
              ],
              ["fontColor", "hiliteColor", "textStyle"],
              ["removeFormat"],
              ["outdent", "indent"],
              ["align", "horizontalRule", "list", "lineHeight"],
              ["table"],
              // (min-width: 992)
              [
                "%992",
                [
                  ["undo", "redo"],
                  [
                    "font",
                    "fontSize",
                    "formatBlock",
                    "paragraphStyle",
                    "blockquote",
                  ],
                  ["bold", "underline", "italic", "strike"],
                  [
                    "subscript",
                    "superscript",
                    "fontColor",
                    "hiliteColor",
                    "textStyle",
                  ],
                  ["removeFormat"],
                  ["outdent", "indent"],
                  ["align", "horizontalRule", "list", "lineHeight"],
                  ["table", "link"],
                ],
              ],
              // (min-width: 767)
              [
                "%767",
                [
                  ["undo", "redo"],
                  [
                    "font",
                    "fontSize",
                    "formatBlock",
                    "paragraphStyle",
                    "blockquote",
                  ],
                  [
                    "bold",
                    "underline",
                    "italic",
                    "strike",
                    "subscript",
                    "superscript",
                    "fontColor",
                    "hiliteColor",
                    "textStyle",
                  ],
                  ["removeFormat"],
                  ["outdent", "indent"],
                  ["align", "horizontalRule", "list", "lineHeight"],
                  ["table", "link"],
                ],
              ],
              // (min-width: 480)
              [
                "%480",
                [
                  ["undo", "redo"],
                  [
                    "font",
                    "fontSize",
                    "formatBlock",
                    "paragraphStyle",
                    "blockquote",
                  ],
                  [
                    "bold",
                    "underline",
                    "italic",
                    "strike",
                    "subscript",
                    "superscript",
                    "fontColor",
                    "hiliteColor",
                    "textStyle",
                    "removeFormat",
                  ],
                  [
                    "outdent",
                    "indent",
                    "align",
                    "horizontalRule",
                    "list",
                    "lineHeight",
                  ],
                  ["table", "link"],
                ],
              ],
            ],
          }}
          defaultValue={this.state.notebook.text}
          setDefaultStyle="font-family: sans-serif; font-size: 14px; text-align: center"
        />
      </div>
    );
  }
}

export default NoteEditor;
