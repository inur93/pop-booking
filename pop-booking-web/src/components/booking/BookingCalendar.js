import React from 'react';
import {observer} from "mobx-react";
import PropTypes from 'prop-types';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import {decorate, observable, transaction} from 'mobx';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import CreateBooking from "./CreateBooking";
import EditBooking from "./EditBooking";
import {D} from '../../D';
import {toast} from 'react-toastify';
import {Glyphicon} from "react-bootstrap";
import FloatingBtn from "../shared/FloatingBtn";
import ViewBooking from "./ViewBooking";


BigCalendar.momentLocalizer(moment);


class BookingCalendar extends React.Component {

    views = {
        MONTH: 'month',
        WEEK: 'week',
        DAY: 'day'
    }
    modals = {
        EDIT_BOOKING: 'editBooking',
        CREATE_BOOKING: 'createBooking',
        VIEW_BOOKING: 'viewBooking'
    }
    currentDate = new Date();
    selectedStartDate = new Date();
    selectedEndDate = new Date();

    currentModal = null;
    currentBooking = null;

    currentView = this.views.MONTH;


    onNavigate = (date, view, action) => {
        this.currentDate = date;
    }

    onView = (view) => {
        this.currentView = view;
    }

    onSelectSlot = (selection) => {
        if (selection.action === 'click' && this.currentView !== this.views.DAY) {
            transaction(() => {
                this.currentDate = selection.start;
                this.currentView = this.views.DAY;
            });
            return;
        }
        if (!this.props.stores.security.isLoggedIn) {
            toast.info(D('You have to be logged in to make a booking'));
            return;
        }
        //action, start, end, slots(array of dates)
        transaction(() => {
            this.selectedStartDate = selection.start;
            this.selectedEndDate = selection.end;
            this.currentModal = this.modals.CREATE_BOOKING;
        });
    }

    onSelectEvent = (booking, evt) => {
        if (!this.props.stores.security.isLoggedIn || (this.props.stores.security.user.id !== booking.booker.id)) {
            this.currentBooking = booking;
            this.currentModal = this.modals.VIEW_BOOKING;
            return;
        }else {
            this.currentBooking = booking;
            this.currentModal = this.modals.EDIT_BOOKING;
        }
    }

    onSelecting = ({start, end}) => {

        /*
        if(!SecurityStore.isLoggedIn)
        transaction(() => {
            this.selectedStartDate = start;
            this.selectedEndDate = end;
            this.currentModal = this.modals.CREATE_BOOKING;
        });*/
        return true;
    }

    timeFormat = (date, culture, localizer) => {
        return localizer.format(date, 'HH:mm');
    }

    timeRangeFormat = ({start, end}, culture, localizer) => {
        return this.timeFormat(start, culture, localizer) + ' - ' + this.timeFormat(end, culture, localizer);
    }

    dateFormat = (date, culture, localizer) => {
        return localizer.format(date, "DD. MMMM YYYY");
    }

    dateRangeFormat = ({start, end}, culture, localizer) => {
        return this.dateFormat(start, culture, localizer) + ' - ' + this.dateFormat(end, culture, localizer);
    }

    dayFormat = (date, culture, localizer) => {
        return '';
        //return localizer.format(date, 'DDD', culture);
    }

    eventPropGetter = (event, start, end, isSelected) => {
        return {
            style: {
                backgroundColor: event.color,
                borderRadius: '0px',
                /* opacity: 0.8,*/
                color: 'black',
                border: '1px solid black',
                borderColor: 'rgba(0,0,0,0.2)',
                display: 'block'
            }
        };

    }

    render() {
        const {booking, security, language: langStore } = this.props.stores;
        const {isLoggedIn} = security;
        const {language} = langStore;
        const {bookings} = booking;
        const messages = {
            allDay: D('All day'),
            previous: <Glyphicon glyph='chevron-left'/>,
            next: <Glyphicon glyph='chevron-right'/>,
            today: <Glyphicon glyph='screenshot'/>,
            month: D('Month'),
            week: D('Week'),
            day: D('Day'),
            agenda: D('Agenda'),
            date: D('Date'),
            time: D('Time'),
            event: D('Event'),
            showMore: (num) => {
                return `${D('Show more')} +${num}`;
            }
        }

        const {stores} = this.props;
        return (

            <div style={{height: 'calc(100vh - 100px)'}}>
                {(this.currentModal === this.modals.CREATE_BOOKING) &&
                <CreateBooking bookableItemStore={stores.bookableItem} bookingStore={stores.booking} locale={language}
                               defaultFrom={this.selectedStartDate} defaultTo={this.selectedEndDate}
                               onExit={() => this.currentModal = null}/>}
                {(this.currentModal === this.modals.EDIT_BOOKING) &&
                <EditBooking store={stores.booking} locale={language}
                             booking={this.currentBooking}
                             onExit={() => this.currentModal = null}/>}
                {(this.currentModal === this.modals.VIEW_BOOKING) &&
                <ViewBooking onExit={() => this.currentModal = null}
                             booking={this.currentBooking}/>}

                <BigCalendar
                    onView={this.onView}
                    view={this.currentView}
                    messages={messages}
                    date={this.currentDate}
                    formats={{
                        dateFormat: 'DD',
                        timeGutterFormat: this.timeFormat,
                        selectRangeFormat: this.timeRangeFormat,
                        dayFormat: this.dayFormat,
                        dayRangeHeaderFormat: this.dateRangeFormat,
                        eventTimeRangeFormat: this.timeRangeFormat,
                        eventTimeRangeStartFormat: this.timeFormat,
                        eventTimeRangeEndFormat: this.timeFormat

                    }}
                    culture={language}
                    popup={true}
                    events={bookings.toJSON()}
                    onNavigate={this.onNavigate}
                    onSelectSlot={this.onSelectSlot}
                    onSelectEvent={this.onSelectEvent}
                    onSelecting={this.onSelecting}
                    views={['month', 'day']}
                    selectable={true}
                    step={30}
                    min={new Date(0, 1, 1, 10)}
                    max={new Date(0, 1, 1, 22)}

                    eventPropGetter={this.eventPropGetter}
                />
                {isLoggedIn && <FloatingBtn onClick={() => this.currentModal = this.modals.CREATE_BOOKING}/>}
            </div>

        );
    }
}

export default observer(BookingCalendar);

BookingCalendar.propTypes = {
    stores: PropTypes.object
};

decorate(BookingCalendar, {
    currentDate: observable,
    selectedStartDate: observable,
    selectedEndDate: observable,
    currentModal: observable,
    currentBooking: observable,
    currentView: observable
});
