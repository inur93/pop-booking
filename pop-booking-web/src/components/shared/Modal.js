import React from 'react';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import { Modal, OverlayTrigger, Button } from 'react-bootstrap';


export default class MyModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: true,
            title: props.title,
            buttons: props.buttons
        };

    }

    setButtons = (newButtons) => {
        this.setState({
            buttons: newButtons
        })
    }

    setTitle = (newTile) => {
        this.setState({
            title: newTile
        });
    }

    getId = () => {
        return this.props.id;
    }

    close = () => {
        this.setState({ showModal: false });
    }

    open = () => {
        this.setState({ showModal: true });
    }

    render() {
        let content = <div>
            <div className="modal-backdrop fade in" onClick={this.close}></div>
            <div role="dialog" tabIndex="-1" className="fade in modal" style={{ display: "block" }}>
                <div className="modal-dialog">
                    <div className="modal-content" role="document">
                        <div className="modal-header">
                            <button type="button" className="close" aria-label="Close" onClick={this.close}>
                                <span aria-hidden="true">×</span>
                            </button>
                            <h4 className="modal-title">{this.state.title}</h4>
                        </div>
                        <div className="modal-body">
                            {this.props.content}
                        </div>
                        {!this.props.hideButtons &&
                        <div className="modal-footer">
                            {this.state.buttons}
                        </div>
                        }
                    </div>
                </div>
            </div>
        </div>
        return this.state.showModal && (
            this.props.isForm ?
                <form id={this.props.formId}>
                    {content}
                </form> :
                <div>
                    {content}
                </div>);
    }
}