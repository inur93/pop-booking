import React from 'react';
//misc
import RestClient from '../shared/RestClient';
import {extendObservable} from 'mobx';
//components
//controllers

class BookableObjectController {

    bookableItems;
    constructor() {
        extendObservable(this, {
            bookableItems: [],

        });
        this.getAllBookableItems();
    }
   /* getBookableItemsByType(type) {
        return RestClient.GET('/bookableobjects/' + type)
         .catch(err => this.defaultCallback(null, err, "Could not retrieve bookable items by type."));
    }*/

    getAllBookableItems() {
        return RestClient.GET('/bookableobjects/')
            .then(res => {
                this.bookableItems.replace(res);
            });
    }

   /* updateBookableItem(item) {
        return RestClient.POST('/bookableobjects/update', item)
            .then(response => this.defaultCallback(response, null, "Bookable item updated."))
            .catch(err => this.defaultCallback(null, err, "Could not update bookable item."));
    }*/

   /* createBookableItem(item) {
        return RestClient.POST('/bookableobjects/create', item)
            .then(response => this.defaultCallback(response, null, "Bookable item created."))
            .catch(err => this.defaultCallback(null, err, "Could not create bookable item."));
    }*/

    /*deleteBookableItem(id, callback) {
        return RestClient.DELETE('/bookableobjects/delete/' + id)
            .then(response => this.defaultCallback(response, null, "Bookable item deleted."))
            .catch(err => this.defaultCallback(null, err, "Could not delete bookable item."));
    }*/

   /* getBookableItemTypes() {
        return RestClient.GET('/bookableobjects/gettypes')
            .catch(err => this.defaultCallback(null, err, "Could not retrieve bookable item types."));
    }*/
}

export default BookableObjectController;