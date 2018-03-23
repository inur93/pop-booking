import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {extendObservable} from 'mobx';
import Booking from "../../models/Booking";
import {Button, Col, ControlLabel, FormGroup, FormControl, Modal, Row, Form, Grid} from "react-bootstrap";
import Calendar from "react-calendar";
import TimePicker from 'react-bootstrap-time-picker';
import StoreRegistry from "../../controllers/StoreRegistry";
import LanguageStore, {D} from "../../controllers/LanguageStore";
import {toast} from 'react-toastify';

class EditBooking extends Component {

    fromDate;
    fromTime;
    toDate;
    toTime;

    step = 30;

    isLoading;

    constructor(props) {
        super(props);
        let df = props.booking.start;
        let dt = props.booking.end;
        let ft = df.getHours() * 60 * 60 + (df.getMinutes() - df.getMinutes() % this.step) * 60;
        let tt = dt.getHours() * 60 * 60 + (dt.getMinutes() - dt.getMinutes() % this.step) * 60;
        extendObservable(this, {
            fromDate: df,
            fromTime: ft,
            toDate: dt,
            toTime: tt,
            isLoading: false
        });
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
        StoreRegistry.getBookingStore().updateBooking(booking)
            .then(res => {
                this.props.onExit();
                this.isLoading = false;
            }).catch(reason => {
            this.isLoading = false;
            toast.error(reason.message);
        })
    }

    deleteBooking = () => {
        this.isLoading = true;
        this.props.booking.delete()
            .then(() => {
                this.isLoading = false;
                this.props.onExit();
            }).catch(reason => {
            this.isLoading = false;
            toast.error(reason.message);
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
                                        <Calendar id="edit-from-date-picker" value={fromDate}
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
                                        <Calendar id="edit-to-date-picker" value={toDate}
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
    booking: PropTypes.instanceOf(Booking)
}

EditBooking.defaultProps = {}