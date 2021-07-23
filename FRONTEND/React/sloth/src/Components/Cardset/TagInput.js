import React from "react";
import Button from "react-bootstrap/Button";

const TagInput = props => {
    const [tags, setTags] = React.useState([]);
    const addTags = event => {
        if (event.key === " " && event.target.value !== "") {
            //event.target.value = event.target.value.filter(c => c!==" ");
            event.target.value = event.target.value.replace(" ", "");
            setTags([...tags, event.target.value]);
            props.selectedTags.push(event.target.value);
            event.target.value = "";
        }
    };
  const removeTags = t => {
    setTags([...tags.filter(tag => tag !== t)]);
    props.deselectTag(t);
};
  return (
    <div className="tags-input">
        {props.selectedTags.map((tag, index) => (
          <Button variant="secondary" size="sm" key={index} onClick={() => removeTags(tag)}>
            <span>{tag}</span>
          </Button>
        ))}
      <input
        type="text"
        onKeyUp={(event) => addTags(event)}
        placeholder="Press space to add tags"
      />
    </div>
  );
};
export default TagInput;
