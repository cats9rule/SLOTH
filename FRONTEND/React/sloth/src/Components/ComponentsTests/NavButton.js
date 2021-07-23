import React from 'react'

function NavButton(props) {
    return (
        <React.Fragment>
            <button className="btn btn-light" onClick={() => props.changeQuestion(props.index)}>{props.index+1}</button>
        </React.Fragment>
    )
}

export default NavButton
