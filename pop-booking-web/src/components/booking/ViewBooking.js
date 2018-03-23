import React from 'react';

//misc
import Helper from '../../shared/HelperFunctions';


//components
import Dropzone from 'react-dropzone';
import { SelectBookable, SelectDate, SelectTime } from '../shared/BookingComponents';
import ReactUploadFile from 'react-upload-file';

//controllers
import MessageController from '../../controllers/MessageController';
import BookingController from '../../controllers/BookingController';
import LanguageStore, {D} from "../../controllers/LanguageStore";

export default class ViewBooking extends React.Component {

    constructor(props) {
        super(props);

        var b = props.booking;
        var id = props.id;
        this.toDateId = id + 'to-date';
        this.toTimeId = id + 'to-time';
        this.fromDateId = id + 'from-date';
        this.fromTimeId = id + 'from-time';
        var start = new Date(b.start);
        var end = new Date(b.end);

        this.state = {
            editMode: props.editMode || false,
            start: start,
            fromDate: Helper.getDateAsString(start),
            fromTime: Helper.getTimeFromDateTime(start),
            end: end,
            toDate: Helper.getDateAsString(end),
            toTime: Helper.getTimeFromDateTime(end),
            bookableItem: props.booking.bookableItem.name
        }
    }

    getBooking = () => {
        var fromDate = new Date(this.state.fromDate).getTime() + this.state.fromTime * 1000;
        var toDate = new Date(this.state.toDate).getTime() + this.state.toTime * 1000;

        var booking = this.props.booking;
        booking.start = fromDate;
        booking.end = toDate;
        booking.bookableItem = this.bookableItem;
        return booking;
    }

    getBookingId = () => {
        return this.props.booking.id;
    }

    setBookableItem = (bookableItem) => {
        this.bookableItem = bookableItem;
    }

    setFromTime = (time) => {
        this.setState({
            fromTime: time
        });
    }

    setFromDate = (date) => {
        this.setState({
            fromDate: date
        });
    }

    setToTime = (time) => {
        this.setState({
            toTime: time
        });
    }

    setToDate = (date) => {
        this.setState({
            toDate: date
        });
    }

    onDragEnter = (var1, var2, var3) => {
        debugger;
    }

    onDragLeave = (var1, var2, var3) => {
        debugger;
    }

    onDropCheckin = (acceptedFiles, rejectedFiles) => {
        if (rejectedFiles && rejectedFiles.length > 0) {
            MessageController.addWarningMessage(rejectedFiles[0].name + " has wrong format. Only .png, jpeg files allowed.");
        }

        if (acceptedFiles && acceptedFiles.length > 1) {
            MessageController.addWarningMessage("Only a single file is allowed");
            return false;
        }


        this.setState({
            checkInImage: acceptedFiles[0]
        })

    }

    onDropCheckout = (acceptedFiles, rejectedFiles) => {
        if (rejectedFiles && rejectedFiles.length > 0) {
            MessageController.addWarningMessage(rejectedFiles[0].name + " has wrong format. Only .png, jpeg files allowed.");
        }

        if (acceptedFiles && acceptedFiles.length > 1) {
            MessageController.addWarningMessage("Only a single file is allowed");
            return false;
        }


        this.setState({
            checkOutImage: acceptedFiles[0]
        })

    }


    render() {
        //TODO langauge translation
        return (
            <div>
                <div className="form-group">
                    <label>{D('Booker')}:</label><p>{this.props.booking.booker.name || this.props.booking.booker.username}</p>

                </div>
                <div className="form-group">
                    {
                        this.state.editMode ?
                            <div>
                                <div>
                                    <label>{D('from date')}:</label>
                                    <SelectDate
                                        onChange={this.setFromDate}
                                        date={this.state.fromDate}
                                        id={this.fromDateId} />
                                </div>
                                <div>
                                    <label>{D('from time')}:</label>
                                    <SelectTime
                                        onChange={this.setFromTime}
                                        id={this.fromTimeId}
                                        time={this.state.fromTime} />
                                </div>
                            </div>
                            :
                            <div >
                                <label>{D('from')}</label>
                                <p>{Helper.getDateAsStringAndFormat(this.state.start)}</p>
                            </div>
                    }
                </div>
                <div className="form-group">
                    {
                        this.state.editMode ?
                            <div>
                                <div>
                                    <label>{D('to date')}:</label>
                                    <SelectDate
                                        onChange={this.setToDate}
                                        date={this.state.toDate}
                                        id={this.toDateId} />
                                </div>
                                <div>
                                    <label>{D('to time')}:</label>
                                    <SelectTime
                                        onChange={this.setToTime}
                                        id={this.toTimeId}
                                        time={this.state.toTime} />
                                </div>
                            </div>
                            :
                            <div >
                                <label>{D('to')}</label>
                                <p>{Helper.getDateAsStringAndFormat(this.state.end)}</p>
                            </div>
                    }

                </div>
                <div className="form-group">
                    {
                        this.state.editMode ?
                            <SelectBookable selected={this.state.bookableItem} onChange={this.setBookableItem} id={this.props.booking.bookableItem.bookingType} label={D('Unit') + ":"} /> :
                            <div>
                                <label>{D('Unit')}</label>
                                <p>{this.state.bookableItem}</p>
                            </div>
                    }

                </div>
            </div>
        );
    }
}
