import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {Button, Col, ControlLabel, FormGroup, Grid, Modal, Row} from "react-bootstrap";
import {Typeahead} from "react-bootstrap-typeahead";
import {decorate, observable} from 'mobx';
import 'react-bootstrap-typeahead/css/Typeahead.css';

import TimePicker from 'react-bootstrap-time-picker';
import Calendar from "react-calendar";
import {D} from '../../D';
import {toast} from 'react-toastify';
import BookableObjectsStore from "../../controllers/BookableObjectsStore";
import BookingStore from "../../controllers/BookingStore";

class CreateBooking extends Component {

    fromDate;
    fromTime;
    toDate;
    toTime;

    selectedItems = [];
    step = 30;

    constructor(props) {
        super(props);

        let min = 10*60*60;
        let max = 21*60*60;

        let df = props.defaultFrom || new Date();
        let dt = props.defaultTo || new Date();
        this.fromTime = df.getHours() * 60 * 60 + (df.getMinutes() - df.getMinutes() % this.step) * 60;
        if(this.fromTime < min) this.fromTime = min;
        if(this.fromTime > max) this.fromTime = max;
        this.toTime = dt.getHours() * 60 * 60 + (dt.getMinutes() - dt.getMinutes() % this.step) * 60;
        if(this.toTime < min) this.toTime = min;
        if(this.toTime > max) this.toTime = max;

        this.fromDate = props.defaultFrom || new Date();
        this.toDate = props.defaultTo || new Date();
    }

    setBookableItems = (selected) => {
        this.selectedItems = selected;
    }

    createBooking = () => {

        this.fromDate.setHours(0, 0, 0, 0);
        this.toDate.setHours(0, 0, 0, 0);
        let from = this.fromDate.getTime() + this.fromTime * 1000;
        let to = this.toDate.getTime() + this.toTime * 1000;

        this.props.bookingStore.createBookings(this.selectedItems.map(item => {
            return {
                bookableItem: item.asJson(),
                dateFrom: from,
                dateTo: to
            }
        })).then(() => {
            toast.success(D('Booking created succesfully'));
            this.props.onExit();
        });
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
        const {fromDate, fromTime, toDate, toTime} = this;
        const {activeBookableItems} = this.props.bookableItemStore;
        const {onExit} = this.props;
        let maxDuration = 0;
        this.selectedItems.forEach(item => maxDuration = maxDuration ? item.maxBookableHours < maxDuration ? item.maxBookableHours : maxDuration : item.maxBookableHours);
        return (
            <Modal show onHide={onExit}>
                <Modal.Header closeButton>
                    <Modal.Title>{D('Create booking')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Grid fluid>
                        <Row>
                            <Col xs={12}>
                                <Typeahead required multiple clearButton labelKey={(value) => {
                                    return value && value.name;
                                }}
                                           placeholder={D('Select kayak kanoo or meetingroom')}
                                           options={activeBookableItems}
                                           onChange={this.setBookableItems}/>
                            </Col>
                        </Row>
                        {(maxDuration > 0) &&
                        <Row>
                            <Col xs={12}>
                                <FormGroup>
                                    <ControlLabel>{`${D('You can only book for a maximum of')} ${maxDuration} ${D('hours')}`}</ControlLabel>
                                </FormGroup>
                            </Col>
                        </Row>
                        }
                        <Row>
                            <Col xs={12} sm={6}>
                                <FormGroup>
                                    <ControlLabel>{D('From')}</ControlLabel>
                                    <div className="calendar-picker-container">
                                        <Calendar id="from-date-picker" locale={this.props.locale} value={fromDate}
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
                                        <Calendar id="to-date-picker" locale={this.props.locale} value={toDate} onChange={this.toDateChanged}/>
                                    </div>
                                    <TimePicker format={24} start="10:00" end="21:00" step={this.step} value={toTime}
                                                onChange={this.toTimeChanged} style={{maxWidth: '350px'}}/>
                                </FormGroup>
                            </Col>
                        </Row>

                    </Grid>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="primary" onClick={this.createBooking}
                            disabled={this.selectedItems.length === 0}>{D('Create')}</Button>
                    <Button onClick={onExit}>{D('Close')}</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default observer(CreateBooking)

CreateBooking.propTypes = {
    bookableItemStore: PropTypes.instanceOf(BookableObjectsStore),
    bookingStore: PropTypes.instanceOf(BookingStore),
    onExit: PropTypes.func,
    defaultFrom: PropTypes.object,
    defaultTo: PropTypes.object,
    locale: PropTypes.string
}

CreateBooking.defaultProps = {
    locale: 'en'
}

decorate(CreateBooking, {
    fromDate: observable,
    fromTime: observable,
    toDate: observable,
    toTime: observable,
    selectedItems: observable
})