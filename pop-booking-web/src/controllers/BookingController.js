import React from 'react';
import {extendObservable} from 'mobx';
import RestClient from '../shared/RestClient';
import Booking from "../models/Booking";


class BookingController {

    path = '/v1/bookings'
    bookings;

    constructor() {
        extendObservable(this, {
            bookings: []
        })
        let from = new Date();
        from.setDate(-30);

        let to = new Date();
        to.setDate(to.getDate()+30);

        this.getBookings(from, to);
    }



    getBookings = (start, end) => {
        RestClient.GET('/v1/bookings/?start=' + start.valueOf() + '&end=' + end.valueOf())
            .then(events => this.bookings.replace(events.map(e => new Booking(e, this))));
    }

    getById = (id) => {
        return RestClient.GET(this.path + "/" + id)
            .then(res => {
                this.bookings.push(new Booking(res, this));
            })
    }

    createBookings(events) {
        return RestClient.POST('/v1/bookings/create', events)
            .then(created => {
                if(created){
                    created.forEach(c => this.bookings.push(new Booking(c, this)));
                }
               return created;
            })
    }

    updateBooking = (booking) => {
        return RestClient.PUT('/v1/bookings/' + booking.id, booking.asJson())
            .then(updated => {
                booking.updateFromJson(updated);
                return updated;
            })
    }

    deleteBooking = (booking) => {
        return RestClient.DELETE('/v1/bookings/' + booking.id)
            .then(() => {
                this.bookings.remove(booking);
            })
    }

    /*updateBooking = (booking, callback) => {
        var updatedBooking = {
            id: booking.id,
            dateFrom: booking.start,
            dateTo: booking.end,
            bookableItem: booking.bookableItem,
            booker: booking.booker
        }

        return Api.POST('/v1/bookings/update', updatedBooking)
            .then(response => {
                this.defaultCallback(response, null, callback);
                this.closeViewBooking();
                this.eventsChanged();
            })
            .catch(err => this.defaultCallback(null, err, callback));
    }

    createBooking(event) {
        return Api.PUT('/v1/bookings/new', event)
            .then(response => {
                callback(response);
                this.eventsChanged();
            })
    }

    createMultipleBookings(bookings) {
        return Api.PUT('/v1/bookings/multiplenew', bookings)
            .then(res => this.defaultCallback(res))
            .catch(err => this.defaultCallback(null, err, ""));
    }*/


    /* show = (id) => {
         var comp = null;
         switch (id) {
             case this.kanooKayakTitle:
                 if (this.kanooKayakComp) {
                     comp = this.kanooKayakComp;
                 } else {
                     comp = <BookingCalendar ref={r => this.kanooKajakCalendar = r || this.kanooKajakCalendar}
                         key={Guid.create()}
                         startTime={process.env.REACT_APP_KANOO_START_TIME}
                         endTime={process.env.REACT_APP_KANOO_END_TIME}
                         id="KANOO_AND_KAJAK" />;
                     this.kanooKayakComp = comp;
                 }
                 break;
             case this.meetingroomTitle:
                 if (this.meetingroomComp) {
                     comp = this.meetingroomComp;
                 } else {
                     comp = <BookingCalendar ref={r => this.meetingroomCalendar = r || this.meetingroomCalendar}
                         key={Guid.create()}
                         startTime={process.env.REACT_APP_MEETINGROOM_START_TIME}
                         endTime={process.env.REACT_APP_MEETINGROOM_END_TIME}
                         id="MEETINGROOM" />;
                     this.meetingroomComp = comp;
                 }
                 break;
             default:
                 return;
         }
         if (comp) {
             ReactDOM.render(comp, document.getElementById("main-content"));
         }
     }

     addEventsChangedListener = (listener) => {
         this.eventsListener.push(listener);
     }

     eventsChanged = () => {
         this.eventsListener.forEach(listener => listener.eventsChanged());
     }

     viewBooking = (booking, calendarId) => {

         this.currentModalId = this.currentModalBaseId + booking.id;
         this.currentBookingInModal = booking;
         var viewBookingModal = <ViewBooking
             ref={r => this.currentBookingInModal.modalRef = r}
             booking={booking}
             id={this.currentModalId} />;
         ModalControllar.showModal(this.currentModalId, this.viewTitle, viewBookingModal, this.getViewButtons());
         this.cancelEdit();
     }

     getEditButtons = () => {
         var booking = this.currentBookingInModal;
         if (!this.isBookingEditable(booking)) {
             // MessageController.addInfoMessage("Booking no longer editable");
             return [];
         } else {
             return [
                 <button key={0} id="savebtn" className="btn btn-default btn-primary" onClick={this.saveBooking}>Save</button>,
                 <button key={1} id="cancelbtn" className="btn btn-default" onClick={this.cancelEdit}>Cancel</button>,
                 <button key={2} id="deletebtn" className="btn btn-default" onClick={this.deleteBooking}>Delete</button>,
             ];
         }
     }

     getViewButtons = () => {
         var booking = this.currentBookingInModal;
         if (!this.isBookingEditable(booking)) {
             // MessageController.addInfoMessage("Booking no longer editable");
             return [];
         } else {
             return [
                 <button key={0} id="editbtn" className="btn btn-default" onClick={this.editBooking}>Edit</button>,
                 <button key={1} id="deletebtn" className="btn btn-default" onClick={this.deleteBooking}>Delete</button>
             ];
         }
     }

     isBookingEditable = (booking) => {
         if (!booking) return false;
         if (booking && booking.start < new Date()) return false;
         if (!LoginController.isLoggedIn()) return false;
         if (booking.booker.username !== LoginController.getUsername()) return false;

         return true;
     }

     editBooking = () => {
         this.currentBookingInModal.modalRef.setState({
             editMode: true
         });
         ModalControllar.updateButtons(this.currentModalId, this.getEditButtons());
         ModalControllar.updateTitle(this.currentModalId, this.editTitle);
     }

     cancelEdit = () => {
         if (this.currentBookingInModal.modalRef) {
             this.currentBookingInModal.modalRef.setState({
                 editMode: false
             });
             ModalControllar.updateButtons(this.currentModalId, this.getViewButtons());
             ModalControllar.updateTitle(this.currentModalId, this.viewTitle);
         }
     }

     saveBooking = () => {
         var booking = this.currentBookingInModal.modalRef.getBooking();
         this.updateBooking(booking);
     }

     closeViewBooking = () => {
         this.cancelEdit(); // make sure that editmode is cancelled
         ModalControllar.hideModal(this.currentModalId);
     }

     getMyBookings() {
         var userId = LoginController.getUserId();
         if (userId) {
             return Api.GET('/v1/bookings/mybookings/' + userId + '?fromDate=' + new Date().getTime());
         }
         return null;
     }

     getEvents(fromDate, toDate, type) {
         return Api.GET('/v1/bookings/' + type + '?start=' + fromDate + '&end=' + toDate);
         // .then(response => this.defaultCallback(response))
         // .catch(err => this.defaultCallback(null, err));;
     }

     deleteBooking = () => {
         //event.preventDefault();
         var bookingId = this.currentBookingInModal.modalRef.getBooking().id;
         if (bookingId) {
             Api.DELETE('/v1/bookings/delete/' + bookingId)
                 .then(response => {
                     this.closeViewBooking();
                     MessageController.addSuccessMessage(response.message);
                     this.eventsChanged();
                 }).catch(err => {
                     MessageController.addDangerMessage(err.message);
                 });
         }
     }

     updateBooking = (booking, callback) => {
         var updatedBooking = {
             id: booking.id,
             dateFrom: booking.start,
             dateTo: booking.end,
             bookableItem: booking.bookableItem,
             booker: booking.booker
         }

         return Api.POST('/v1/bookings/update', updatedBooking)
             .then(response => {
                 this.defaultCallback(response, null, callback);
                 this.closeViewBooking();
                 this.eventsChanged();
             })
             .catch(err => this.defaultCallback(null, err, callback));
     }

     createBooking(event, callback) {
         return Api.PUT('/v1/bookings/new', event)
             .then(response => {
                 callback(response);
                 this.eventsChanged();
             })
             .catch(err => callback(null, err));
     }

     createMultipleBookings(bookings) {
         return Api.PUT('/v1/bookings/multiplenew', bookings)
             .then(res => this.defaultCallback(res))
             .catch(err => this.defaultCallback(null, err, ""));
     }*/
}

export default BookingController;