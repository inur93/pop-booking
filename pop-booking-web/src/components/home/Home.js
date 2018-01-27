import React from 'react';
import '../../stylesheets/css/App.css';

//components
import Helper from '../../shared/HelperFunctions';
import MyBookings from './MyBookings';
import EventPost from './EventPost';

//controllers
import PostsController from '../../controllers/PostsController';
import LoginController from '../../controllers/LoginController';
import MainController from '../../controllers/MainController';
import { Select } from '../shared/Select';

export default class Home extends React.Component {

    posts = [];
    bookings = [];
    createPostForm = "textarea-create-post";
    createPostTextArea = "post-content";
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            postsLoading: true,
            showBookings: props.showBookings
        }
    }

    componentDidMount() {
        this.updatePosts();
    }

    updatePosts = () => {
        this.setState({
            postsLoading: true
        })
        PostsController.getPosts().then(newPosts => {
            newPosts.forEach(x => this.posts.push(x));
            const posts = this.posts.map(p => {

                return this.createPostJsx(p);
            });
            this.setState({
                posts: posts,
                postsLoading: false
            });
        });
    }

    removePost = (id) => {
        if (!id) return;
        PostsController.remove(id)
            .then(res => {
                var posts = this.state.posts;
                posts = posts.filter(el => el.props.id !== id);
                this.setState(
                    {
                        posts: posts
                    }
                )
            })
    }

    createPostJsx = (post) => {
        var userId = LoginController.getUserId();
        //convert to local time
        var cur = new Date(post.created);
        cur.setMinutes(cur.getMinutes() - new Date().getTimezoneOffset());
        post.created = cur.getTime();
        return <EventPost
            post={post}
            key={post.id}
            id={post.id}
            onRemove={this.removePost}
            removable={
                post && post.createdBy &&
                post.createdBy.id === userId} />;
    }

    createPost = () => {
        event.preventDefault();
        var serialize = require('form-serialize');
        var form = document.querySelector('#' + this.createPostForm);
        var data = serialize(form, { hash: true });
        if (data.post) {
            PostsController.create(data.post)
                .then(item => {
                    var posts = this.state.posts;
                    posts.push(this.createPostJsx(item));
                    this.setState({
                        posts: posts
                    })
                    var el = document.getElementById(this.createPostTextArea);
                    if (el) el.value = '';
                });
        }
    }

    render() {
        return (
            <div>
                <MyBookings showBookings={this.state.showBookings} />
                <div>
                    <h2>Posts</h2>
                </div>
                {this.state.postsLoading ?
                    <div className="loader"> </div> :
                    this.state.posts
                }
                {!this.state.postsLoading && this.state.posts.length == 0 &&
                    <div>No posts</div>
                }
                {this.state.showBookings &&
                    <form id={this.createPostForm}>
                        <textarea id={this.createPostTextArea} name="post" className="form-control" placeholder="Write post..." rows="3">
                        </textarea>
                        <div className="form-group">
                            <input type="button" name="submit" className="btn btn-primary pull-right" onClick={this.createPost} value="Post" />
                        </div>
                    </form>
                }

            </div>
        );
    }
}

