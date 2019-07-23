import 'react';
import {decorate, observable} from 'mobx';
import Booking from "../models/Booking";


class BookingStore {

    client;
    path = '/v1/bookings';
    bookings = observable.array([]);

    constructor(client) {
        this.client = client;
        let from = new Date();
        from.setDate(-30);

        let to = new Date();
        to.setDate(to.getDate()+30);

        this.getBookings(from, to);
    }



    getBookings = (start, end) => {
        this.client.GET(`${this.path}/?start=${start.valueOf()}&end=${end.valueOf()}`)
            .then(events => this.bookings.replace(events.map(e => new Booking(e, this))));
    }

    getById = (id) => {
        return this.client.GET(`${this.path}/${id}`)
            .then(res => {
                this.bookings.push(new Booking(res, this));
            })
    }

    createBookings(events) {
        return this.client.POST(`${this.path}/create`, events)
            .then(created => {
                if(created){
                    created.forEach(c => this.bookings.push(new Booking(c, this)));
                }
               return created;
            })
    }

    updateBooking = (booking) => {
        return this.client.PUT(`${this.path}/${booking.id}`, booking.asJson())
            .then(updated => {
                booking.updateFromJson(updated);
                return updated;
            })
    }

    deleteBooking = (booking) => {
        return this.client.DELETE(`${this.path}/${booking.id}`)
            .then(() => {
                this.bookings.remove(booking);
            })
    }
}

export default BookingStore;

decorate(BookingStore, {
    bookings: observable
})