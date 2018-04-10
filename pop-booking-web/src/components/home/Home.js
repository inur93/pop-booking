import React from 'react';
import '../../stylesheets/css/App.css';
import EventPost from './EventPost';
import BookingList from "./BookingList";
import {decorate, observable} from 'mobx';
import {Button, FormControl, FormGroup} from "react-bootstrap";
import {observer} from "mobx-react";
import PropTypes from 'prop-types';
import SecurityStore from "../../controllers/SecurityStore";
import Spinner from "../../shared/Spinner";
import {D} from '../../D';

import PostsStore from "../../controllers/PostsStore";

class Home extends React.Component {


    bookings = [];
    postContent = "";
    sendError = false;


    createPost = () => {
        this.sendError = false;
        this.props.stores.post.create(this.postContent)
            .then(() => this.postContent = "")
            .catch(() => this.sendError = true);
    };

    render() {
        const {post : postStore, security} = this.props.stores;
        const {posts, isLoading, error, getPosts} = postStore;
        const {isAdmin} = security;
        return (
            <div style={{padding: '15px'}}>
                <BookingList bookings={[]}/>
                <div>{((posts && posts.length > 0) || isAdmin) &&
                <h2>{D('Posts')}</h2>
                }
                </div>
                {<Spinner show={isLoading} error={error} retryFunc={getPosts}/>}
                {!isLoading && posts.map(p => <EventPost post={p} key={p.id}/>)}

                {isAdmin &&
                <FormGroup>
                    <FormControl componentClass="textarea" value={this.postContent}
                                 onChange={(evt) => this.postContent = evt.target.value}
                                 placeholder={D('Write a post')}/>
                </FormGroup>
                }
                {isAdmin &&
                <Button onClick={this.createPost} disabled={!this.postContent} bsStyle="primary"
                        className="pull-right">{this.sendError ? D('Retry') : D('Post')}</Button>
                }
            </div>
        );
    }
}

export default observer(Home);
Home.propTypes = {
    stores: PropTypes.shape({
        security: PropTypes.instanceOf(SecurityStore),
        post: PropTypes.instanceOf(PostsStore)
    })
}

decorate(Home, {
    postContent: observable,
    sendError: observable,
})

