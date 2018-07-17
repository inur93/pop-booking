import {computed, decorate, transaction} from 'mobx';
import SecurityStore from "../controllers/SecurityStore";
import {D} from "../D";

export default class Booking {

    store;

    id;

    dateFrom;
    dateTo;
    booker;
    color;
    bookableItem;

    constructor(json, store) {
        this.store = store;
        Object.assign(this, json);
        this.color = json.bookableItem.color;

    }

    get title(){
        return D(this.bookableItem.name) + ": " + (this.booker.roomNo || this.booker.name || D("(unknown user)"));
    }

    get selectable(){
        return SecurityStore.user && SecurityStore.user.id === this.booker.id
    }

    get start(){
        return new Date(this.dateFrom);
    }

    get end(){
        return new Date(this.dateTo);
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

decorate(Booking, {
    title: computed,
    selectable: computed,
    start: computed,
    end: computed
})