import Api from '../shared/RestApi';
import MessageController from './MessageController';
import BasicController from './BasicController';
import {computed, extendObservable} from 'mobx';
import HelperFunctions from "../shared/HelperFunctions";
class PostsController extends BasicController{

    page = 0;
    number = 5;
    step = 1;

    v1 = '/v1/posts';

    posts;
    isLoading;
    constructor(){
        super();

        extendObservable(this, {
            posts: [],
            isLoading: true
        })

        this.getPosts();
    }


    getPosts = () => {
        this.queryPosts(this.page, this.number);
    }

    getMorePosts = () => {
        this.page += this.step;
        return this.queryPosts(this.page, this.number);
    }

    queryPosts = (page, number) => {
        Api.GET('/v1/posts?page=' + page + '&number=' + number).then(posts => {
            if(posts && posts.length) {
                posts.forEach(p => this.posts.push(new Post(p, this)))
            }
        })
    }

    create = (content) => {
        return Api.POST(this.v1 + '/create', {
            content: content,
            created: new Date()
        }).catch(err => MessageController.addDangerMessage(err.message));
    }

    remove = (id) => {
        if (id) {
            return Api.DELETE(this.v1 + '/delete/' + id)
                .catch(err => MessageController.addDangerMessage(err.message));
        }
    }

}

export default new PostsController();

export class Post {

    createdFormatted;
    constructor(post, store){
        this.createdFormatted = HelperFunctions.getDateAsStringAndFormat(post.created);

        extendObservable(this, {
            title: post.title,
            removable: computed(() => {
                return true; //TODO
            }),
            createdBy: post.createdBy,

        });
    }
}