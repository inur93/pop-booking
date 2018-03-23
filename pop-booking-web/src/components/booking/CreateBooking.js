import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {Button, Col, ControlLabel, FormGroup, Grid, Modal, Row} from "react-bootstrap";
import BookableObjectsController from "../../controllers/BookableObjectsController";
import {Typeahead} from "react-bootstrap-typeahead";
import {extendObservable} from 'mobx';
//import DatePicker from 'react-date-picker';
import 'react-bootstrap-typeahead/css/Typeahead.css';

import TimePicker from 'react-bootstrap-time-picker';
import Calendar from "react-calendar";
import StoreRegistry from "../../controllers/StoreRegistry";
import LanguageStore, {D} from "../../controllers/LanguageStore";
import {toast} from 'react-toastify';

class CreateBooking extends Component {

    fromDate;
    fromTime;
    toDate;
    toTime;

    selectedItems;
    step = 30;

    constructor(props) {
        super(props);


        let df = props.defaultFrom || new Date();
        let dt = props.defaultTo || new Date();
        let ft = df.getHours() * 60 * 60 + (df.getMinutes() - df.getMinutes() % this.step) * 60;
        let tt = dt.getHours() * 60 * 60 + (dt.getMinutes() - dt.getMinutes() % this.step) * 60;

        extendObservable(this, {
            fromDate: props.defaultFrom || new Date(),
            fromTime: ft,
            toDate: props.defaultTo || new Date(),
            toTime: tt,
            selectedItems: []
        });
    }

    setBookableItems = (selected) => {
        this.selectedItems = selected;
    }

    createBooking = () => {

        this.fromDate.setHours(0, 0, 0, 0);
        this.toDate.setHours(0, 0, 0, 0);
        let from = this.fromDate.getTime() + this.fromTime * 1000;
        let to = this.toDate.getTime() + this.toTime * 1000;

        StoreRegistry.getBookingStore().createBookings(this.selectedItems.map(item => {
            return {
                bookableItem: item,
                dateFrom: from,
                dateTo: to
            }
        })).then(() => {
            toast.success(LanguageStore.SUCCESS_BOOKING_CREATED);
            this.props.onExit();
        })
            .catch((reason) => {
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
        const {fromDate, fromTime, toDate, toTime} = this;
        const {bookableItems} = this.props.bookableItemStore;
        const {onExit} = this.props;
        return (
            <Modal show onHide={onExit}>
                <Modal.Header closeButton>
                    <Modal.Title>{D('Create booking')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Grid fluid>
                        <Row>
                            <Col xs={12}>
                                <Typeahead required multiple clearButton labelKey="name"
                                           placeholder={D('Select kayak kanoo or meetingroom')}
                                           options={bookableItems.toJSON()}
                                           onChange={this.setBookableItems}/>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} sm={6}>
                                <FormGroup>
                                    <ControlLabel>{D('From')}</ControlLabel>
                                    <div className="calendar-picker-container">
                                        <Calendar id="from-date-picker" value={fromDate}
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
                                        <Calendar id="to-date-picker" value={toDate} onChange={this.toDateChanged}/>
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
    bookableItemStore: PropTypes.instanceOf(BookableObjectsController),
    onExit: PropTypes.func,
    defaultFrom: PropTypes.object,
    defaultTo: PropTypes.object
}

CreateBooking.defaultProps = {}