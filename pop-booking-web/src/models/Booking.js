import {computed, extendObservable, transaction} from 'mobx';
import moment from 'moment';
import SecurityStore from "../controllers/SecurityStore";

export default class Booking {

    store;

    id;

    start;
    end;
    title;
    selectable;
    dateFrom;
    dateTo;
    booker;
    color;
    constructor(json, store) {
        this.store = store;
        //this.start = new Date(json.dateFrom);
        //this.end = new Date(json.dateTo);
        //this.title = json.bookableItem.name;
        Object.assign(this, json);
        extendObservable(this, {
            title: json.bookableItem.name + ": " + json.booker.name + " " + (json.booker.roomNo || ""),
            color: json.bookableItem.color,
            selectable: SecurityStore.user && SecurityStore.user.id === this.booker.id,
            start: computed(() => new Date(this.dateFrom)),
            end: computed(() => new Date(this.dateTo))
        });
    }


    updateFromJson = (json) => {
        transaction(() => {
            this.dateFrom = json.dateFrom;
            this.dateTo = json.dateTo;
        });
    };

    delete = () => {
        return this.store.deleteBooking(this);
    }

    asJson = () => {
        return {
            id: this.id,
            created: this.created,
            dateFrom: this.dateFrom,
            dateTo: this.dateTo,
            booker: this.booker,
            bookableItem: this.bookableItem
        }
    }

}