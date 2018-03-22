import RestClient from '../shared/RestClient';
import MessageController from './MessageController';
import PostItem from "../models/PostItem";
import {extendObservable} from 'mobx';

export default class PostsController {

    page = 0;
    number = 5;
    step = 1;

    path = '/v1/posts';

    posts;
    isLoading;
    error;


    constructor() {
        extendObservable(this, {
            posts: [],
            isLoading: true,
            error: false
        });

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
        return RestClient.GET(this.path + '?page=' + page + '&number=' + number)
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
        return RestClient.POST(this.path, {
            content: content,
            created: new Date()
        }).then(created => {
            this.posts.push(new PostItem(created, this));
        }).catch(err => {
            MessageController.addDangerMessage(err.message);
            throw err;
        });
    }

    remove = (item) => {
        if (item) {
            return RestClient.DELETE(this.path + "/" + item.id)
                .then(res => {
                    this.posts = this.posts.filter(p => p.id !== item.id);
                })
                .catch(err => {
                    //TODO
                });
        }
    }

}
