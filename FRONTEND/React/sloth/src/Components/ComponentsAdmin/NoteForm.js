import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import "../../styles/global.css";
import { Note } from "../../Models/note";
import SunEditor,{buttonList} from "suneditor-react";
import 'suneditor/dist/css/suneditor.min.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

class NoteForm extends Component {
    constructor(props) {
        super(props);

        if (this.props.action === "create") {
            this.state = {
                action: "create",
                text: "Text",
                title: "New Note"
            }
        }
        if (this.props.action === "edit") {
            this.state = {
                action: "edit",
                text: this.props.note.text,
                title: this.props.note.title
            }
        }

        this.editor = React.createRef();
        this.textChangeHandler = this.textChangeHandler.bind(this);
        this.titleChangeHandler = this.titleChangeHandler.bind(this);
    }

    textChangeHandler = (event) => {
        this.setState({text: event.target.value});
    }

    titleChangeHandler = (event) => {
        this.setState({title: event.target.value});
    }

    getSunEditorInstance = (sunEditor) => {
        this.editor.current = sunEditor;
    };

    fetchCreateNote = () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json"  },
            body: JSON.stringify({
                text: this.editor.current.getContents(),
                title: this.state.title
            }),
        };

        const fetchFunction = async () =>  {
            const response = await fetch("https://localhost:5001/SLOTH/CreateNote/" + this.props.notebookid, requestOptions);
            if (response.ok) {
                this.props.setStateAction();
            }

        }

        fetchFunction();
    }

    fetchEditNote= () => {
        const requestOptions = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: this.props.note.id,
                text: this.state.text,
                title: this.state.title
            }),
        };

        const fetchFunction = async () =>  {
            const response = await fetch("https://localhost:5001/SLOTH/UpdateNote/", requestOptions);
            if (response.ok) {
                this.props.setStateAction();
            }
        }

        fetchFunction();
    }

    createNote = (event) => {
        event.preventDefault();
        this.fetchCreateNote();
    }

    editNote = (event) => {
        event.preventDefault();
        this.fetchEditNote();
    }

    cancel() {
        confirmAlert({
            title: 'Confirm to cancel',
            message: 'You sure you want to cancel?',
            buttons: [
              {
                label: 'Yup',
                onClick: () => {
                    this.props.setStateAction();
                }
              },
              {
                label: 'Nope'
              }
            ]
          });
    }

    renderCreate() {
        return (
            <React.Fragment>
                <h3>Create Note</h3>
                <Form className="container pt-5" onSubmit={this.createNote}>
                    <Form.Group as={Row}>
                        <Form.Label column sm={2}>
                           Title:
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control required 
                                          value={this.state.title}
                                          onChange={this.titleChangeHandler}/>
                        </Col>
                    </Form.Group>

                <SunEditor 
                    getSunEditorInstance={this.getSunEditorInstance}
                    setOptions={{
                    height: "100%",
                    buttonList: [
                    // default
                    ['undo', 'redo'],
                    ['font', 'fontSize', 'formatBlock', 'paragraphStyle', 'blockquote'],
                    ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
                    ['fontColor', 'hiliteColor', 'textStyle'],
                    ['removeFormat'],
                    ['outdent', 'indent'],
                    ['align', 'horizontalRule', 'list', 'lineHeight'],
                    ['table'],
                    // (min-width: 992)
                    ['%992', [
                    ['undo', 'redo'],
                    ['font', 'fontSize', 'formatBlock', 'paragraphStyle', 'blockquote'],
                    ['bold', 'underline', 'italic', 'strike'],
                    ['subscript', 'superscript', 'fontColor', 'hiliteColor', 'textStyle'],
                    ['removeFormat'],
                    ['outdent', 'indent'],
                    ['align', 'horizontalRule', 'list', 'lineHeight'],
                    ['table', 'link']
                    ]],
                    // (min-width: 767)
                    ['%767', [
                    ['undo', 'redo'],
                    ['font', 'fontSize', 'formatBlock', 'paragraphStyle', 'blockquote'],
                    ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript', 'fontColor', 'hiliteColor', 'textStyle'],
                    ['removeFormat'],
                    ['outdent', 'indent'],
                    ['align', 'horizontalRule', 'list', 'lineHeight'],
                    ['table', 'link']
                    ]],
                    // (min-width: 480)
                    ['%480', [
                    ['undo', 'redo'],
                    ['font', 'fontSize', 'formatBlock', 'paragraphStyle', 'blockquote'],
                    ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript', 'fontColor', 'hiliteColor', 'textStyle', 'removeFormat'],
                    ['outdent', 'indent', 'align', 'horizontalRule', 'list', 'lineHeight'],
                    ['table', 'link']
                    ]]
                    ]
                    }}
                    defaultValue="<p>The editor's default value</p>"
                    setDefaultStyle="font-family: sans-serif; font-size: 14px; text-align: justify"
                />
                
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
        )
    }

    renderEdit() {
        return (
            <React.Fragment>
                <h3>Edit Card</h3>
                <Form className="container pt-5" onSubmit={this.editNote}>
                    <Form.Group as={Row}>
                        <Form.Label column sm={2}>
                            Title:
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control required 
                                          value={this.state.title}
                                          onChange={this.titleChangeHandler}/>
                        </Col>
                    </Form.Group>

                    <SunEditor 
                    getSunEditorInstance={this.getSunEditorInstance}
                    setOptions={{
                    height: "100%",
                    buttonList: [
                    // default
                    ['undo', 'redo'],
                    ['font', 'fontSize', 'formatBlock', 'paragraphStyle', 'blockquote'],
                    ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
                    ['fontColor', 'hiliteColor', 'textStyle'],
                    ['removeFormat'],
                    ['outdent', 'indent'],
                    ['align', 'horizontalRule', 'list', 'lineHeight'],
                    ['table'],
                    // (min-width: 992)
                    ['%992', [
                    ['undo', 'redo'],
                    ['font', 'fontSize', 'formatBlock', 'paragraphStyle', 'blockquote'],
                    ['bold', 'underline', 'italic', 'strike'],
                    ['subscript', 'superscript', 'fontColor', 'hiliteColor', 'textStyle'],
                    ['removeFormat'],
                    ['outdent', 'indent'],
                    ['align', 'horizontalRule', 'list', 'lineHeight'],
                    ['table', 'link']
                    ]],
                    // (min-width: 767)
                    ['%767', [
                    ['undo', 'redo'],
                    ['font', 'fontSize', 'formatBlock', 'paragraphStyle', 'blockquote'],
                    ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript', 'fontColor', 'hiliteColor', 'textStyle'],
                    ['removeFormat'],
                    ['outdent', 'indent'],
                    ['align', 'horizontalRule', 'list', 'lineHeight'],
                    ['table', 'link']
                    ]],
                    // (min-width: 480)
                    ['%480', [
                    ['undo', 'redo'],
                    ['font', 'fontSize', 'formatBlock', 'paragraphStyle', 'blockquote'],
                    ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript', 'fontColor', 'hiliteColor', 'textStyle', 'removeFormat'],
                    ['outdent', 'indent', 'align', 'horizontalRule', 'list', 'lineHeight'],
                    ['table', 'link']
                    ]]
                    ]
                    }}
                    defaultValue={this.state.text}
                    setDefaultStyle="font-family: sans-serif; font-size: 14px; text-align: justify"
                />

                    <Row>
                        <Button variant="success" type="submit">
                            Update
                        </Button>
                        <Button variant="danger" onClick={() => this.cancel()}>
                            Cancel
                        </Button>
                    </Row>
                </Form>
            </React.Fragment>
        )
    }

    render() {
        let element = null;
        if (this.state.action === "create") {
            element = this.renderCreate();
        }
        else if (this.state.action === "edit") {
            element = this.renderEdit();
        }
        else {
            element = 
            <div>
                NoteForm Error: this.props.action is not valid.
                <br />
                this.props.action: {this.props.action}
            </div>
        }

        return element;
    }
}

export default NoteForm;