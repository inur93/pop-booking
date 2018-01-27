import React from 'react';

import Helper from '../../shared/HelperFunctions';

//controllers
import LoginController from '../../controllers/LoginController';

export default class EventPost extends React.Component {

    constructor(props) {
        super(props);
        LoginController.addLoginStateChangedListener(this);
        this.state = {
            removable: props.removable
        }
    }

    loggedIn = () => {
        this.updateState();
    }

    loggedOut = () => {
        this.updateState();
    }

    updateState = () => {
        var userId = LoginController.getUserId();
        this.setState({
            removable: userId === this.props.post.createdBy.id
        })
    }

    componentWillUnmount = () => {
        LoginController.removeLoginStateChangedListener(this);
    }

    removePost = () => {
        this.props.onRemove(this.props.id);
    }
    render() {
        return (
            <div className="page-header">
                <h3>{this.props.post.title}</h3>
                <div>
                    <label>{this.props.post.createdBy.name}</label>
                    {this.state.removable &&
                        <a href="#" onClick={this.removePost} className="pull-right transparent-5" data-toggle="tooltip" title="remove">
                            <span className="glyphicon glyphicon-remove">
                            </span>
                        </a>
                    }
                    <label className="pull-right">{Helper.getDateAsStringAndFormat(new Date(this.props.post.created))}</label>
                </div>
                <div className="text-content">{this.props.post.content}</div>
            </div>
        );
    }
}