import 'react';
import {computed, decorate, observable} from 'mobx';
import BookableItem from "../models/BookableItem";

class BookableObjectsStore {

    client;
    path = '/bookableobjects';
    bookableItems = [];

    constructor(client) {
        this.client = client;
        this.getAllBookableItems();
    }

    getAllBookableItems() {
        return this.client.GET(this.path)
            .then(res => {
                this.bookableItems = res.map(item => new BookableItem(item))
            });
    }

    get activeBookableItems() {
        return this.bookableItems.filter(item => item.status === 'ACTIVE');
    }

    get total() {
        return this.bookableItems.length || 0;
    }

    createUnit = (unit) => {
        return this.client.POST(`${this.path}`, unit)
            .then(res => {
                const unit = new BookableItem(res);
                this.bookableItems.push(unit);
                return unit;
            })
    };

    updateUnit = (unit) => {
        return this.client.PUT(`${this.path}/${unit.id}`, unit);
    };

    deleteUnit = (unit) => {
        return this.client.DELETE(`${this.path}/${unit.id}`)
            .then(() => {
                this.bookableItems = this.bookableItems.filter(item => item.id !== unit.id);
            })
    }

}

export default BookableObjectsStore;

decorate(BookableObjectsStore, {
    bookableItems: observable,
    activeBookableItems: computed,
    total: computed
});