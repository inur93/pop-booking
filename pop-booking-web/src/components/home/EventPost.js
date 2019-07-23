import React from 'react';

import Helper from '../../shared/HelperFunctions';
//controllers
import {observer} from "mobx-react";
import PostItem from "../../models/PostItem";
import PropTypes from 'prop-types';

class EventPost extends React.Component {

    removePost = () => {
        this.props.post.delete();
    };

    render() {

        const {title, createdBy, isRemovable, content, created} = this.props.post;
        return (
            <div className="page-header">
                <h3>{title}</h3>
                <div>
                    <label>{createdBy.name}</label>
                    {isRemovable &&
                        <a href="#" onClick={this.removePost} className="pull-right transparent-5" data-toggle="tooltip" title="remove">
                            <span className="glyphicon glyphicon-remove">
                            </span>
                        </a>
                    }
                    <label className="pull-right">{Helper.getDateAsStringAndFormat(new Date(created))}</label>
                </div>
                <div className="text-content">{content}</div>
            </div>
        );
    }
}

export default observer(EventPost);

EventPost.propTypes = {
    post: PropTypes.instanceOf(PostItem)
};