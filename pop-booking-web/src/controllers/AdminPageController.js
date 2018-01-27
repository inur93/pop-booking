import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

//misc
//import Helper from '../shared/HelperFunctions';
import Api from '../shared/RestApi';

//components
import AdminPage from '../components/admin/AdminPage';
//import ViewBooking from '../components/booking/ViewBooking';
//import BookingCalendar from '../components/booking/BookingCalendar';

//controllers
import MessageController from './MessageController';
import BookingController from './BookingController';
import BookableObjectController from './BookableObjectsController';
import BasicController from './BasicController';
import LoginController from './LoginController';



class AdminPageController extends BasicController {

    v1 = '/v1/closedperiods';
    comp = null;

    hide = (id) => {
        return;
    }
    show = (id) => {
        if (!this.comp) {
            this.comp = <AdminPage controller={this} />;
        }
        ReactDOM.render(this.comp, document.getElementById("main-content"));
    }

    getClosedPeriods = (from, to) => {
        return Api.GET(this.v1 + '/get').catch(
            err => {
                MessageController.addDangerMessage(err.message);
            }
        )
    }

    getClosedPeriodsByType = (type, from, to) => {
        return Api.GET(this.v1 + '/get/' + type + '?from=' + from + "&to=" + to);
    }

    getApplicableTypesOptions = () => {
        var promise = BookableObjectController.getBookableItemTypes();
        if (promise) return promise.then(
            list => list.map(function (element) {
                return {
                    id: element,
                    value: element,
                    element: element
                }
            }));
        return [];
    }

    getApplicableItemsOptions = () => {
        var promise = BookableObjectController.getAllBookableItems();

        if (promise) return promise.then(
            list => list.map(function (element) {
                return {
                    id: element.id,
                    value: element.name,
                    element: element
                }
            }));
        return [];
    }

    createClosedPeriod = (item) => {
        return Api.POST(this.v1 + "/create", item)
            .then(res => this.defaultCallback(res, null, "Closed period created."))
            .catch(err => this.defaultCallback(null, err, "An error occurred creating closed period"));

    }

    updateClosedPeriod = (item) => {
        return Api.POST(this.v1 + "/update", item)
            .then(res => this.defaultCallback(res, null, "Closed period updated"))
            .catch(err => this.defaultCallback(null, err, "An error occured updating closed period"));
    }

    deleteClosedPeriod = (id) => {
        return Api.DELETE(this.v1 + "/delete/" + id)
            .then(res => this.defaultCallback(res, null, "Closed period deleted."))
            .catch(err => this.defaultCallback(null, err, "An error occured deleting closed period"));
    }
}

export default (new AdminPageController())