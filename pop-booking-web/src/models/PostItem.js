import {computed, decorate, observable} from 'mobx';
import {stores} from "../controllers/Context";

export default class PostItem {

    store;

    id;
    createdBy;
    created;
    content;

    constructor(json, store) {
        this.store = store;
        Object.assign(this, json);
    }

    get isRemovable() {
        const {user} = stores.security;
        if (user && user.id === this.createdBy.id) return true;
        return false;
    }

    delete = () => {
        this.store.remove(this);
    }

}


decorate(PostItem, {
    isRemovable: computed
})