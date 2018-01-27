import React from 'react';

import Helper from '../../shared/HelperFunctions';

//controllers
import LoginController from '../../controllers/LoginController';
import PropTypes from 'prop-types';

export default class EventPost extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {title, removable, createdBy, createdFormatted, content} = this.props.post;
        return (
            <div className="page-header">
                <h3>{title}</h3>
                <div>
                    <label>{createdBy.name}</label>
                    {removable &&
                        <a href="#" onClick={this.removePost} className="pull-right transparent-5" data-toggle="tooltip" title="remove">
                            <span className="glyphicon glyphicon-remove">
                            </span>
                        </a>
                    }
                    <label className="pull-right">{createdFormatted}</label>
                </div>
                <div className="text-content">{content}</div>
            </div>
        );
    }
}

EventPost.propTypes = {
    post: PropTypes.object.isRequired
}