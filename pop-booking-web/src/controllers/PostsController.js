import Api from '../shared/RestApi';
import MessageController from './MessageController';
import BasicController from './BasicController';

class PostsController extends BasicController{

    page = 0;
    number = 5;
    step = 1;

    v1 = '/v1/posts';

    getPosts = () => {
        return this.queryPosts(this.page, this.number);
    }

    getMorePosts = () => {
        this.page += this.step;
        return this.queryPosts(this.page, this.number);
    }

    queryPosts = (page, number) => {
        return Api.GET('/v1/posts?page=' + page + '&number=' + number);
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

export default (new PostsController());