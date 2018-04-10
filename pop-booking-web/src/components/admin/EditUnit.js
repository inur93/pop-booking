import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {decorate, observable} from 'mobx';
import {D} from "../../D";
import {Button, Col, ControlLabel, DropdownButton, FormControl, FormGroup, MenuItem, Modal, Row} from "react-bootstrap";
import {Typeahead} from "react-bootstrap-typeahead";
import {toast} from 'react-toastify';
import BookableObjectsStore from "../../controllers/BookableObjectsStore";
import BookableItem from "../../models/BookableItem";
import {ChromePicker} from "react-color";

class EditUnit extends Component {

    unit;

    constructor(props) {
        super(props);
        this.unit = JSON.parse(JSON.stringify(props.unit));
    }

    save = () => {
        const {_name, color, maxBookableHours, status, statusMessage} = this.unit;
        this.props.unit._name = _name;
        this.props.unit.color = color;
        this.props.unit.maxBookableHours = maxBookableHours;
        this.props.unit.status = status;
        this.props.unit.statusMessage = statusMessage;

        this.props.store.updateUnit(this.props.unit.asJson())
            .then(saved => {
                if (saved) {
                    toast.success(D('Unit has been updated'));
                    this.props.onExit();
                }
            })
    }

    setStatus = (value) => {
        this.unit.status = value;
    }

    onColorChanged = (value) => {
        this.unit.color = value.hex;
    }

    render() {
        const {onExit} = this.props;
        const {_name, color, maxBookableHours, status, statusMessage} = this.unit;
        return (
            <Modal show onHide={onExit}>
                <Modal.Header closeButton>
                    <Modal.Title>{`${D('Administrate unit')}: ${_name}`}</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <form>
                        <Row>
                            <Col sm={6}>
                                <FormGroup>
                                    <ControlLabel>{D('Name')}</ControlLabel>
                                    <FormControl type="text" value={_name}
                                                 onChange={(evt) => this.unit._name = evt.target.value}/>
                                </FormGroup>
                                <FormGroup>
                                    <ControlLabel>{D('Max bookable hours')}</ControlLabel>
                                    <FormControl type={'number'} value={maxBookableHours}
                                                 onChange={(evt) => this.unit.maxBookableHours = evt.target.value}/>
                                </FormGroup>

                                <FormGroup>
                                    <ControlLabel  style={{width: '100%'}}>{D('Status')}</ControlLabel>
                                    <DropdownButton id="select-status" title={D(status)}>
                                        <MenuItem onSelect={this.setStatus} eventKey="ACTIVE">{D('Active')}</MenuItem>
                                        <MenuItem onSelect={this.setStatus} eventKey="OUT_OF_ORDER">{D('Out of order')}</MenuItem>
                                    </DropdownButton>
                                </FormGroup>
                            </Col>
                            <Col sm={6}>
                                <FormGroup>
                                    <ControlLabel>{D('Color')}</ControlLabel>
                                    <ChromePicker id="color" onChange={this.onColorChanged} color={color} disableAlpha/>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12}>
                                <FormGroup>
                                    <ControlLabel>{D('Status message')}</ControlLabel>
                                    <FormControl type="text" value={statusMessage}
                                                 onChange={(evt) => this.unit.statusMessage = evt.target.value}/>
                                </FormGroup>
                            </Col>
                        </Row>

                    </form>

                </Modal.Body>
                <Modal.Footer>

                    <Button bsStyle="primary" onClick={this.save} disabled={this.isLoading}>{D('Save')}</Button>
                    <Button onClick={onExit}>{D('Close')}</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default observer(EditUnit)

decorate(EditUnit, {
    unit: observable
})
EditUnit.propTypes = {
    onExit: PropTypes.func,
    unit: PropTypes.instanceOf(BookableItem),
    store: PropTypes.instanceOf(BookableObjectsStore)
}

EditUnit.defaultProps = {}