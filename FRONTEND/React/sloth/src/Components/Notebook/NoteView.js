import Button from "react-bootstrap/Button";
import React, { Component } from "react";
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import "../../styles/notebook.css"

class NoteView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      note: props.note,
    };
  }

  componentDidMount() {}

  componentDidUpdate(prevProps) {
    if (prevProps.note != this.props.note) {
      this.setState({
        note: this.props.note,
      });
    }
  }

  render() {

    if(this.state.note == null) {
      return <p>Choose a note to view.</p>
    }
    return (
      <React.Fragment>
        <IconButton variant="light" onClick={() => this.props.editNote(this.state.note)}>
          <EditOutlinedIcon color="primary"></EditOutlinedIcon>
        </IconButton>
        <p className="display-4">{this.state.note.title}</p>
        <div dangerouslySetInnerHTML={{__html: this.state.note.text}}></div>
      </React.Fragment>
    );
  }
}

export default NoteView;
