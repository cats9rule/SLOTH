import React from 'react'

function NoteInfo(props) {
    
    let tags = props.note.tags.map((element) => {
        (
            <ul key={element}>{element}</ul>
        )
    });
    
    return (
        <div className="container-fluid">
            <h1>{props.note.name}</h1>
            <h2>Category: {props.note.category}</h2>
            <h2>Tags: </h2>
            <li>{tags}</li> 
            <p>Visibility: {props.note.visibility}</p>        
        </div>
    )
}

export default NoteInfo
