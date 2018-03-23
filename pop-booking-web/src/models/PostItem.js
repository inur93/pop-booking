import SecurityStore from "../controllers/SecurityStore";
import {computed, extendObservable} from 'mobx';

export default class PostItem {

    store;

    id;
    createdBy;
    created;
    content;

    isRemovable;

    constructor(json, store) {
        this.store = store;
        Object.assign(this, json);
        extendObservable(this, {
            isRemovable: computed(this.resolveIsRemovable)
        })
    }

    resolveIsRemovable = () => {
        const {user} = SecurityStore;
        if(user && user.id === this.createdBy.id) return true;
        return false;
    }

    delete = () => {
        this.store.remove(this);
    }

}