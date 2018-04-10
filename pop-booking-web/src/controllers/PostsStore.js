import PostItem from "../models/PostItem";
import {decorate, observable, action} from 'mobx';
import {toast} from 'react-toastify';

export default class PostsStore {

    client;
    page = 0;
    number = 5;
    step = 1;

    path = '/v1/posts';

    posts = observable.array([]);
    isLoading = false;
    error = false;


    constructor(client) {
        this.client = client;
        this.getPosts();
    }

    getPosts = () => {
        return this.queryPosts(this.page, this.number);
    }

    getMorePosts = () => {
        this.page += this.step;
        return this.queryPosts(this.page, this.number);
    }

    queryPosts = (page, number) => {
        this.error = false;
        return this.client.GET(this.path + '?page=' + page + '&number=' + number)
            .then(posts => {
                this.isLoading = false;
                if (posts) {
                    posts.forEach(p => {
                        this.posts.push(new PostItem(p, this));
                    })
                }
            })
            .catch(reason => this.error = true);
    }

    create = (content) => {
        return this.client.POST(this.path, {
            content: content,
            created: new Date()
        }).then((created) => {
            this.pushPost(created);
        }).catch(err => {
            toast.err(err.message);
            throw err;
        });
    };

    pushPost = (post) => {
        this.posts.push(new PostItem(post, this));
    }

    remove = (item) => {
        if (item) {
            return this.client.DELETE(this.path + "/" + item.id)
                .then(action(() => {
                    this.posts = this.posts.filter(p => p.id !== item.id);
                })).catch(err => {
                    //TODO
                });
        }
    }


}

decorate(PostsStore, {
    posts: observable,
    isLoading: observable,
    error: observable,
    pushPost: action
})
