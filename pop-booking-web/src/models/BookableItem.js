import {computed, decorate, observable} from "mobx";
import {D} from "../D";

export default class BookableItem {


    id;

    color;
    bookingType;
    maxBookableHours;
    status;
    statusMessage;
    store;

    _name;

    constructor(json) {
        this.id = json.id;
        this._name = json.name;
        this.bookingType = json.bookingType || null;
        this.color = json.color;
        this.maxBookableHours = json.maxBookableHours;
        this.status = json.status;
        this.statusMessage = json.statusMessage;
    }

    get name() {
        return D(this._name);
    }

    asJson = () => {
        return {
            id: this.id,
            color: this.color,
            bookingType: this.bookingType,
            maxBookableHours: this.maxBookableHours,
            name: this._name,
            status: this.status,
            statusMessage: this.statusMessage
        }
    }
}

decorate(BookableItem, {
    name: computed,
    color: observable,
    status: observable,
    statusMessage: observable,
    maxBookableHours: observable
})