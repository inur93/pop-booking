import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {decorate, observable} from 'mobx';
import {D} from "../../D";
import {Button, Col, ControlLabel, DropdownButton, FormControl, FormGroup, MenuItem, Modal, Row} from "react-bootstrap";
import {toast} from 'react-toastify';
import BookableObjectsStore from "../../controllers/BookableObjectsStore";
import {ChromePicker} from "react-color";

class AddUnit extends Component {

    unit;

    constructor(props) {
        super(props);
        this.unit = {
            status: 'ACTIVE',
            color: '#61c4f1',
            statusMessage: "",
            name: "",
            maxBookableHours: 8
        };
    }

    save = () => {
        this.props.store.createUnit(this.unit)
            .then(saved => {
                if (saved) {
                    toast.success(D('Unit has been created'));
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
        const {name, color, maxBookableHours, status} = this.unit;
        return (
            <Modal show onHide={onExit}>
                <Modal.Header closeButton>
                    <Modal.Title>{`${D('Create unit')}`}</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <form>
                        <Row>
                            <Col sm={6}>
                                <FormGroup>
                                    <ControlLabel>{D('Name')}</ControlLabel>
                                    <FormControl type="text" value={name} onChange={(evt) => this.unit.name = evt.target.value}/>
                                </FormGroup>
                                <FormGroup>
                                    <ControlLabel>{D('Max bookable hours')}</ControlLabel>
                                    <FormControl type={'number'} value={maxBookableHours}
                                                 onChange={(evt) => this.unit.maxBookableHours = evt.target.value}/>
                                </FormGroup>

                                <FormGroup>
                                    <ControlLabel style={{width: '100%'}}>{D('Status')}</ControlLabel>
                                    <DropdownButton id="select-status" title={D(status)}>
                                        <MenuItem onSelect={this.setStatus} eventKey="ACTIVE">{D('Active')}</MenuItem>
                                        <MenuItem onSelect={this.setStatus}
                                                  eventKey="OUT_OF_ORDER">{D('Out of order')}</MenuItem>
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
                    </form>

                </Modal.Body>
                <Modal.Footer>

                    <Button bsStyle="primary" onClick={this.save} disabled={this.isLoading}>{D('Create')}</Button>
                    <Button onClick={onExit}>{D('Cancel')}</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default observer(AddUnit)

decorate(AddUnit, {
    unit: observable
})
AddUnit.propTypes = {
    onExit: PropTypes.func,
    store: PropTypes.instanceOf(BookableObjectsStore)
}

AddUnit.defaultProps = {}