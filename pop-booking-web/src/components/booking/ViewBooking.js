import React from 'react';
import Helper from '../../shared/HelperFunctions';
import {D} from '../../D';
import {Button, Col, ControlLabel, Form, FormGroup, Grid, Modal, Row, FormControl} from "react-bootstrap";
import PropTypes from 'prop-types';
import Booking from "../../models/Booking";

export default class ViewBooking extends React.Component {

    render() {
        const {onExit, booking} = this.props;
        const {bookableItem, start, end, booker} = booking;
        return (
            <Modal show onHide={onExit}>
                <Modal.Header closeButton>
                    <Modal.Title>{D('View booking')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Grid fluid>
                        <Row>
                            <Col xs={12}>
                                <FormGroup>
                                    <ControlLabel>{D('Booker')}</ControlLabel>
                                    <FormControl.Static>{`${booker.name || booker.username} ${booker.roomNo}`}</FormControl.Static>
                                </FormGroup>
                            </Col>
                            <Col xs={12}>

                                <FormGroup>
                                    <ControlLabel>{D('Unit')}</ControlLabel>{' '}
                                    <FormControl.Static>{bookableItem.name}</FormControl.Static>
                                </FormGroup>

                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} sm={6}>
                                <FormGroup>
                                    <ControlLabel>{D('From')}</ControlLabel>
                                    <FormControl.Static>{Helper.getDateAndTimeAsString(start)}</FormControl.Static>
                                </FormGroup>
                            </Col>
                            <Col xs={12} sm={6}>
                                <FormGroup>
                                    <ControlLabel>{D('To')}</ControlLabel>
                                    <FormControl.Static>{Helper.getDateAndTimeAsString(end)}</FormControl.Static>
                                </FormGroup>
                            </Col>
                        </Row>
                    </Grid>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={onExit}>{D('Close')}</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

ViewBooking.propTypes = {
    onExit: PropTypes.func.isRequired,
    booking: PropTypes.instanceOf(Booking)
}
