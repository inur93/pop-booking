import React from 'react';
import '../../stylesheets/css/App.css';
//components
import EventPost from './EventPost';
//controllers
import PostsController from '../../controllers/PostsController';
import BookingList from "./BookingList";
import {extendObservable} from 'mobx';
import {Button, FormControl, FormGroup} from "react-bootstrap";
import {observer} from "mobx-react";
import PropTypes from 'prop-types';
import SecurityStore from "../../controllers/SecurityStore";
import Spinner from "../../shared/Spinner";
import LanguageStore from "../../controllers/LanguageStore";

class Home extends React.Component {


    bookings = [];
    createPostForm = "textarea-create-post";
    createPostTextArea = "post-content";
    postContent;

    sendError;
    constructor(props) {
        super(props);
        extendObservable(this, {
            postsLoading: true,
            postContent: "",
            sendError: false
        })

    }

    createPost = () => {
        this.sendError = false;
       this.props.postStore.create(this.postContent)
           .then(() => this.postContent = "")
           .catch(() => this.sendError = true);
    }

    render() {
        const {posts, isLoading, error, getPosts} = this.props.postStore;
        const {isLoggedIn, isAdmin} = SecurityStore;

        const {POSTS_TITLE, HOME_WRITE_POST, BTN_POST, BTN_RETRY} = LanguageStore;
        return (
            <div style={{padding: '15px'}}>
                <BookingList bookings={[]}/>
                <div>
                    <h2>{POSTS_TITLE}</h2>
                </div>
                {<Spinner show={isLoading} error={error} retryFunc={getPosts}/>}
                {!isLoading && posts.map(p => <EventPost post={p} key={p.id}/>)}

                {isAdmin &&
                <FormGroup>
                    <FormControl componentClass="textarea" value={this.postContent}
                                 onChange={(evt) => this.postContent = evt.target.value} placeholder={HOME_WRITE_POST}/>
                </FormGroup>
                }
                {isAdmin &&
                <Button onClick={this.createPost} disabled={!this.postContent} bsStyle="primary"
                        className="pull-right">{this.sendError ? BTN_RETRY : BTN_POST}</Button>
                }
            </div>
        );
    }
}
export default observer(Home);
Home.propTypes = {
    postStore: PropTypes.instanceOf(PostsController)
}

