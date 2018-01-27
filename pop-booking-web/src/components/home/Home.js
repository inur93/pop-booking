import React from 'react';
import '../../stylesheets/css/App.css';
//components
import MyBookings from './MyBookings';
import EventPost from './EventPost';
//controllers
import PostsController from '../../controllers/PostsController';
import LoginController from '../../controllers/LoginController';

import {extendObservable} from 'mobx';
import {observer} from 'mobx-react';
import TestStore from "../../controllers/TestStore";

class Home extends React.Component {

    posts = [];
    bookings = [];
    createPostForm = "textarea-create-post";
    createPostTextArea = "post-content";
    uiStore;
    postsStore;

    constructor(props) {
        super(props);
        this.uiStore = new HomeUiStore();
        this.postsStore = PostsController;
    }

    componentDidMount() {
        this.updatePosts();
    }

    updatePosts = () => {

    }

    /*    removePost = (id) => {
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
        }*/

    /*    createPostJsx = (post) => {
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
        }*/

    /*  createPost = () => {
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
      }*/

    createPost = () => {

    }

    render() {
        return (
            <div>
                {/*<MyBookings showBookings={this.state.showBookings} />*/}
                <div>
                    <h2>Posts</h2>
                </div>
                <div>
                    <input type={"text"} value={TestStore.text} onChange={(e) => TestStore.text = e.target.value}/>
                </div>
                <div>
                    {TestStore.text}
                </div>
                {this.postsStore.isLoading ?
                    <div className="loader"></div> :
                    this.postsStore.posts.map(p => <EventPost post={p}/>)
                }
                {!this.postsStore.postsLoading && this.postsStore.posts.length == 0 &&
                <div>No posts</div>
                }
                {this.uiStore.showBookings &&
                <form id={this.createPostForm}>
                        <textarea id={this.createPostTextArea} name="post" className="form-control"
                                  placeholder="Write post..." rows="3">
                        </textarea>
                    <div className="form-group">
                        <input type="button" name="submit" className="btn btn-primary pull-right"
                               onClick={this.createPost} value="Post"/>
                    </div>
                </form>
                }

            </div>
        );
    }
}

export default observer(Home)

export class HomeUiStore {

    showBookings;

    constructor() {
        extendObservable(this, {
            showBookings: false,

        })
    }
}



