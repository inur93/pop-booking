import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

//misc
import Helper from '../shared/HelperFunctions';
import Api from '../shared/RestApi';

//components
import BookingCalendar from '../components/booking/BookingCalendar';
import ViewBooking from '../components/booking/ViewBooking';

//controllers
import MessageController from './MessageController';
import ModalControllar from './ModalController';
import LoginController from './LoginController';
import BookingController from './BookingController';
import BasicController from './BasicController';

class BookableObjectController extends BasicController {

    currentModalBaseId = 'viewBookingModalId';
    currentModalId = null;
    viewTitle = "Booking";
    editTitle = "Edit booking";
    viewBookingModal = null;
    viewBookingModalRef = null;
    constructor() {
        super();
        this.eventsListener = [];
    }
    getBookableItemsByType(type) {
        return Api.GET('/bookableobjects/' + type)
         .catch(err => this.defaultCallback(null, err, "Could not retrieve bookable items by type."));
    }

    getAllBookableItems() {
        return Api.GET('/bookableobjects/all');
    }

    updateBookableItem(item) {
        return Api.POST('/bookableobjects/update', item)
            .then(response => this.defaultCallback(response, null, "Bookable item updated."))
            .catch(err => this.defaultCallback(null, err, "Could not update bookable item."));
    }

    createBookableItem(item) {
        return Api.POST('/bookableobjects/create', item)
            .then(response => this.defaultCallback(response, null, "Bookable item created."))
            .catch(err => this.defaultCallback(null, err, "Could not create bookable item."));
    }

    deleteBookableItem(id, callback) {
        return Api.DELETE('/bookableobjects/delete/' + id)
            .then(response => this.defaultCallback(response, null, "Bookable item deleted."))
            .catch(err => this.defaultCallback(null, err, "Could not delete bookable item."));
    }

    getBookableItemTypes() {
        return Api.GET('/bookableobjects/gettypes')
            .catch(err => this.defaultCallback(null, err, "Could not retrieve bookable item types."));
    }
}

export default (new BookableObjectController());