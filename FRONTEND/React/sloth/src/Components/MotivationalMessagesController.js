import React, { Component } from 'react';
import { MotivationMessage } from '../Models/motivationMessage.js';

class MotivationMessagesController extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            messages: [],
            fetching: true,
            dbMMChanged: this.props.dbMMChanged
        };
        this.timeout2 = null;
    } 

    fetchMessages() {
        this.setState({
            fetching: true
        });

        let msgs = [];
        fetch("https://localhost:5001/SLOTH/GetMotivationalMessages")
            .then(response => response.json())
            .then(data => {
                data.forEach(mm => {
                    let msg = new MotivationMessage(mm.id, mm.name, mm.message);
                    msgs.push(msg);
                });
                console.log(msgs)
                this.setState({messages: msgs, fetching: false});
            })
            .catch(e => {
                console.log(e);
                this.setState({...this.state, fetching: false});
            })
    }

    componentDidMount() {
        this.fetchMessages();
        
        this.timeout = setInterval(() => {
            let current = this.state.index;
            this.setState({index: current + 1});
          }, 30000); //trenutno 30 sekundi
    }

    componentDidUpdate (prevProps) {
        if (prevProps.dbMMChanged != this.props.dbMMChanged && this.props.dbMMChanged)
        {
            this.timeout2 = setTimeout(this.fetchMessages(), 3000); 
            this.props.resetMMChanged();
        }
    }

    componentWillUnmount() {
        clearInterval(this.timeout);
    }

    render() {
        if(this.state.fetching) {
            return <h3>We are getting messages ready wait a bit</h3>;
        }
        else {
            if(this.state.messages != null && this.state.messages.length > 0) {
                let element = this.state.messages[this.state.index % this.state.messages.length];
                return (
                    <div>
                        {/*<h3>{element.name}</h3>  name poruke tbh idk sta ce nam to*/}
                        <h5>{element.message}</h5>
                    </div>
                )
            }
            else return (<p>No messages available, sorry.</p>);
            
        }
    }
}

export default MotivationMessagesController;
