import React from 'react';

//controllers
import MessageController from '../../controllers/MessageController';

export default class MessageList extends React.Component {
    constructor(props) {
        super(props);
        MessageController.setListener(this);
        this.state = {
            messages: []
        };
    }

    update = (messages) => {
        this.setState({
            messages: messages
        });
    }
    render() {
        return (
            <div className="info-box">
                {this.state.messages}
            </div>
        );
    }
}

export class Message extends React.Component {

    render() {
        switch (this.props.type) {
            case "danger":
                return (
                    <div className="alert alert-danger">
                        {this.props.message}
                    </div>
                );
            case "warning":
                return (
                    <div className="alert alert-warning">
                        {this.props.message}
                    </div>
                );
            case "info":
                return (
                    <div className="alert alert-info">
                        {this.props.message}
                    </div>
                );
            case "success":
            default:
                return (
                    <div className="alert alert-success">
                        {this.props.message}
                    </div>
                );

        }
    }
}
