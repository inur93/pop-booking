import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {decorate, observable} from 'mobx';
import Booking from "../../models/Booking";
import {Button, Col, ControlLabel, FormGroup, FormControl, Modal, Row, Form, Grid} from "react-bootstrap";
import Calendar from "react-calendar";
import TimePicker from 'react-bootstrap-time-picker';
import {D} from '../../D';
import {toast} from 'react-toastify';
import BookingStore from "../../controllers/BookingStore";

class EditBooking extends Component {

    fromDate;
    fromTime;
    toDate;
    toTime;

    step = 30;

    isLoading = false;

    constructor(props) {
        super(props);
        this.fromDate = props.booking.start;
        this.toDate = props.booking.end;
        let fromDate = this.fromDate;
        let toDate = this.toDate;
        this.fromTime = fromDate.getHours() * 60 * 60 + (fromDate.getMinutes() - fromDate.getMinutes() % this.step) * 60;
        this.toTime = toDate.getHours() * 60 * 60 + (toDate.getMinutes() - toDate.getMinutes() % this.step) * 60;

    }

    updateBooking = () => {
        this.isLoading = true;
        this.fromDate.setHours(0, 0, 0, 0);
        this.toDate.setHours(0, 0, 0, 0);
        let from = this.fromDate.getTime() + this.fromTime * 1000;
        let to = this.toDate.getTime() + this.toTime * 1000;
        let {booking} = this.props;
        booking.dateFrom = from;
        booking.dateTo = to;
        this.props.store.updateBooking(booking)
            .then(() => {
                this.props.onExit();
                toast.success(D('Booking has been updated'));
                this.isLoading = false;
            }).catch(() => {
            this.isLoading = false;
        })
    }

    deleteBooking = () => {
        this.isLoading = true;
        this.props.booking.delete()
            .then(() => {
                this.isLoading = false;
                toast.success(D('The booking has been deleted'));
                this.props.onExit();
            }).catch(() => {
            this.isLoading = false;
        })
    }

    fromDateChanged = (value) => {
        this.fromDate = value;
        if (value > this.toDate) {
            this.toDate = value;
        }
    }

    fromTimeChanged = (time) => {
        this.fromTime = time;
    }

    toDateChanged = (value) => {
        this.toDate = value;
        if (value < this.fromDate) {
            this.fromDate = value;
        }
    }

    toTimeChanged = (time) => {
        this.toTime = time;
    }

    render() {
        const {onExit, booking} = this.props;
        const {fromDate, fromTime, toDate, toTime, isLoading} = this;
        const {bookableItem} = booking;
        let hasChange = true;


        return (
            <Modal show onHide={onExit}>
                <Modal.Header closeButton>
                    <Modal.Title>{D('Edit booking')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Grid fluid>
                        <Row>
                            <Col xs={12}>
                                <Form style={{display: 'inline-block'}}>
                                    <FormGroup>
                                        <ControlLabel>{D('Unit')}</ControlLabel>{' '}
                                        <FormControl.Static>{bookableItem.name}</FormControl.Static>
                                    </FormGroup>
                                </Form>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} sm={6}>
                                <FormGroup>
                                    <ControlLabel>{D('From')}</ControlLabel>
                                    <div className="calendar-picker-container">
                                        <Calendar id="edit-from-date-picker" locale={this.props.locale} value={fromDate}
                                                  onChange={this.fromDateChanged}/>
                                    </div>
                                    <TimePicker format={24} start="10:00" end="21:00" step={this.step} value={fromTime}
                                                onChange={this.fromTimeChanged} style={{maxWidth: '350px'}}/>
                                </FormGroup>
                            </Col>
                            <Col xs={12} sm={6}>
                                <FormGroup>
                                    <ControlLabel>{D('To')}</ControlLabel>
                                    <div className="calendar-picker-container">
                                        <Calendar id="edit-to-date-picker" locale={this.props.locale} value={toDate}
                                                  onChange={this.toDateChanged}/>
                                    </div>
                                    <TimePicker format={24} start="10:00" end="21:00" step={this.step} value={toTime}
                                                onChange={this.toTimeChanged} style={{maxWidth: '350px'}}/>
                                </FormGroup>
                            </Col>
                        </Row>
                    </Grid>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="danger" onClick={this.deleteBooking}
                            disabled={this.isLoading}>{D('Delete')}</Button>
                    <Button bsStyle="primary" onClick={this.updateBooking} disabled={this.isLoading}
                            disabled={!hasChange}>{D('Update')}</Button>
                    <Button onClick={onExit}>{D('Close')}</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default observer(EditBooking)

EditBooking.propTypes = {
    onExit: PropTypes.func.isRequired,
    booking: PropTypes.instanceOf(Booking),
    store: PropTypes.instanceOf(BookingStore),
    locale: PropTypes.string
}

EditBooking.defaultProps = {
    locale: 'en'
}

decorate(EditBooking, {
    fromDate: observable,
    fromTime: observable,
    toDate: observable,
    toTime: observable,
    isLoading: observable
})