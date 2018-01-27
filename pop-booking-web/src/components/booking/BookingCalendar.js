import React from 'react';
import 'react-date-picker/index.css';
import Helper from '../../shared/HelperFunctions';

//misc
import Guid from '../../shared/Guid';

//components
import { SelectBookable, SelectDate, SelectTime } from '../shared/BookingComponents';
import Calendar from './Calendar';
import { Select } from '../shared/Select';
import {Message} from '../shared/MessageList';

//controllers
import MessageController from '../../controllers/MessageController';
import LoginController from '../../controllers/LoginController';
import BookingController from '../../controllers/BookingController';
import BookableObjectController from '../../controllers/BookableObjectsController';
import AdminPageController from '../../controllers/AdminPageController';


export default class BookingCalendar extends React.Component {

    calendar = {};
    resumeFunction = null;

    constructor(myProps) {
        super();
        this.bookableItems = null;
        var id = myProps.id;
        this.toTimeId = id + "to-time";
        this.toDateId = id + "to-date";
        this.fromTimeId = id + "from-time";
        this.fromDateId = id + "from-date";
        this.calCounter = 0;

        var now = new Date();
        this.state = {
            events: [],
            showForm: LoginController.isLoggedIn(),
            closedPeriods: [],
            calendarComponent: null,
            bookableItems: null,
            bookingBtnPressed: false,
            fromDate: Helper.getDateAsString(now),
            toDate: Helper.getDateAsString(now),
            fromTime: (now.getHours() + 1) % 24 * 3600,
            toTime: (now.getHours() + 2) % 24 * 3600
        };
    }

    componentDidMount() {
        LoginController.addLoginStateChangedListener(this);
        BookingController.addEventsChangedListener(this);

        const comp = <Calendar
            id={this.props.id + "customcalendar" + this.calCounter++}
            key={Guid.create()}
            events={this.getEventItems}
            ref={(c) => this.calendar = c || this.calendar}
            onEventClick={this.handleOnEventClick}
            onDayClick={this.handleOnDayClick}
            eventDrop={this.onEventDrop}
            eventAllow={this.eventAllow}
            onSelect={this.onSelect} />;


        this.setState({
            calendarComponent: comp
        });

        BookableObjectController.getBookableItemsByType(this.props.id)
            .then(res => {
                var list = res.map(x => {
                    return {
                        id: x.id,
                        value: x.name,
                        object: x
                    }
                });
                this.setState({ bookableItems: list });
            });

    }
    eventsChanged = () => {
        debugger;
        this.updateEvents();
    }
    updateEvents = () => {
        this.calendar.refreshEvents();
    }

    loggedIn = () => {
        this.setState({
            showForm: true
        });
    }

    loggedOut = () => {
        this.setState({
            showForm: false
        });
    }

    getEventItems = (start, end, timezone, callback) => {
        BookingController.getEvents(start, end, this.props.id)
            .then(events =>
                events.map(function (event) {
                    return {
                        id: event.id,
                        title: event.booker.username + ": " + event.bookableItem.name,
                        start: event.dateFrom,
                        end: event.dateTo,
                        editable: event.editable,
                        booker: event.booker,
                        bookableItem: event.bookableItem,
                        backgroundColor: event.bookableItem.color
                    };
                }))
            .then(events => callback(events));
        AdminPageController.getClosedPeriodsByType(this.props.id, start, end)
            .then(res => this.showClosedPeriods(res));

    }

    showClosedPeriods = (periods) => {
        var closedPeriods = periods.map(p =>
            <Message key={Guid.create()}
                type={"info"}
                message={"Bookings are not possible in the period from " + 
                Helper.formatDate(p.start, "mmmm dS, yyyy") + " to " + 
                Helper.formatDate(p.end, "mmmm dS, yyyy")}/>
        );
        this.setState({
            closedPeriods: closedPeriods
        })
    }

    eventAllow = (dropLocation, draggedEvent) => {
        return LoginController.isLoggedIn() && !(draggedEvent.start < new Date());
    }

    onEventDrop = (event, delta, revertFunc, jsEvent, ui, view) => {
        //time is updated automatically
        if (!confirm("Are you sure you want to move the booking to " + event.start.format())) {
            revertFunc();
            return;
        }

        BookingController.updateBooking(event, function (response, err) {
            if (err) {
                revertFunc();
            }
        })
    }

    handleOnDayClick = (date, var1, var2, var3) => {
        this.calendar.gotoDay(date);
    }

    onSelect = (start, end, jsEvent, view) => {
        var fromTime = start.hours() * 3600 + start.minutes() * 60;
        var toTime = end.hours() * 3600 + end.minutes() * 60;

        this.setState({
            fromDate: start.format(),
            toDate: end.format(),
            fromTime: fromTime,
            toTime: toTime
        })
    }

    handleOnEventClick = (event) => {
        BookingController.viewBooking(event, this.props.id);
    }

    createBooking = (event) => {
        event.preventDefault();
        this.setState({
            bookingBtnPressed: true
        });
        var fromDate = Number(new Date(this.state.fromDate)) + Number(this.state.fromTime) * 1000;
        var toDate = Number(new Date(this.state.toDate)) + Number(this.state.toTime) * 1000;
        if (this.bookableItems) {
            var itemsList = [];
            this.bookableItems.forEach(item =>
                itemsList.push({
                    bookableItem: item.object, // get the object instead of the select element
                    dateFrom: new Date(fromDate).toJSON(),
                    dateTo: new Date(toDate).toJSON(),
                }));

            BookingController.createMultipleBookings(itemsList)
                .then(res => {
                    this.setState({
                        bookingBtnPressed: false
                    });
                    this.updateEvents();
                });
        } else {
            MessageController.addInfoMessage("No bookable item selected");
            this.setState({
                bookingBtnPressed: false
            });
        }
    }

    setToDate = (date) => {
        this.setState({
            toDate: date
        });
    }

    setToTime = (time) => {
        this.setState({
            toTime: time
        });
    }

    setFromDate = (date) => {
        this.setState({
            fromDate: date
        });
    }

    setFromTime = (time) => {
        this.setState({
            fromTime: time
        });
    }

    setBookableItems = (bookableItems) => {
        event.preventDefault();
        this.bookableItems = bookableItems;
    }

    render() {
        return (

            <div>
                {this.state.closedPeriods}
                <div id={"calendarform" + this.props.id}>
                    {this.state.calendarComponent}
                </div>
                {
                    this.state.showForm ?
                        <form id={this.props.id + "form"} className="col-xs-12">
                            <div className="row control-component">

                                <div className="col-sm-3 col-xs-6">
                                    <label htmlFor={this.fromDateId} className="control-label">from date:</label>
                                    <SelectDate
                                        onChange={this.setFromDate}
                                        date={this.state.fromDate}
                                        id={this.fromDateId} />
                                </div>
                                <div className="col-sm-3 col-xs-6">
                                    <label htmlFor={this.fromTimeId} className="control-label">from time:</label>
                                    <SelectTime
                                        onChange={this.setFromTime}
                                        time={this.state.fromTime}
                                        id={this.fromTimeId} />

                                </div>

                                <div className="col-sm-3 col-xs-6">
                                    <label htmlFor={this.toDateId} className="control-label">to date:</label>

                                    <SelectDate
                                        onChange={this.setToDate}
                                        date={this.state.toDate}
                                        id={this.toDateId} />
                                </div>
                                <div className="col-sm-3 col-xs-6">
                                    <label htmlFor={this.toTimeId} className="control-label">to time:</label>
                                    <SelectTime
                                        onChange={this.toTime}
                                        time={this.state.toTime}
                                        id={this.toTimeId} />
                                </div>

                            </div>
                            <div className="row">
                                <div className="col-sm-3 col-xs-6 form-group">
                                    <Select required
                                        key={"bookableItem-" + this.props.id}
                                        placeholder="Select"
                                        options={this.state.bookableItems}
                                        onChange={this.setBookableItems} />
                                </div>
                                <div className="col-sm-3 col-xs-6 form-group">
                                    {
                                        this.state.bookingBtnPressed ?
                                            <button disabled id="bookBtn" className="btn btn-default btn-block">Booking...</button> :
                                            <button id="bookBtn" className="btn btn-default btn-block" onClick={this.createBooking}>Book</button>
                                    }
                                </div>
                            </div>
                        </form> :
                        <div>Log in to make a booking</div>
                }
            </div>

        );
    }
}


// Data Types: 	event - {title, id, start, (end), whatever } 	location - {
// start, (end), allDay } 	rawEventRange - { start, end } 	eventRange - { start,
// end, isStart, isEnd } 	eventSpan - { start, end, isStart, isEnd, whatever }
// 	eventSeg - { event, whatever } 	seg - { whatever }